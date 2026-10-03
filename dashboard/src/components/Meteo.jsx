import { useState } from "react";
import axios from "axios";
import carte from "../assets/image/carte.jpg"; // adapte le nombre de ../ selon l'emplacement de ce fichier

// Cherche la ville à plusieurs endroits possibles d'un objet utilisateur
const extractCity = (u) => {
  if (!u) return "";
  const loc = u.localisation;
  return (
    u.boutique?.ville ||
    u.producteur?.boutique?.ville ||
    u.producteur?.localisation?.ville ||
    (typeof u.producteur?.localisation === "string" ? u.producteur.localisation : "") ||
    u.ville ||
    (typeof loc === "string" ? loc : loc?.ville) ||
    u.client?.ville ||
    ""
  );
};

// Coordonnées -> nom de ville (OpenStreetMap, gratuit, sans clé)
const reverseCity = async (lat, lon) => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=fr` +
      `&lat=${lat}&lon=${lon}`;
    const r = await fetch(url);
    const a = (await r.json())?.address || {};
    const name = a.city || a.town || a.village || a.municipality || a.county || a.state || "";
    return name.toLowerCase() === "kadiogo" ? "Ouagadougou" : name;
  } catch {
    return "";
  }
};

export default function Meteo() {
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [villeSaisie, setVilleSaisie] = useState("Ouagadougou");

  // Dernier recours : GPS -> météo -> nom de la ville trouvé automatiquement
  const fallbackByGPS = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const [res, nomVille] = await Promise.all([
            axios.get("/api/v1/meteo/coords", { params: { lat, lon } }),
            reverseCity(lat, lon),
          ]);

          setMeteo({ ...res.data, ville: nomVille || "Position actuelle" });
        } catch (err) {
          console.log(err);
          setError("Erreur lors de la récupération météo");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permission refusée pour la localisation");
        setLoading(false);
      }
    );
  };

  const getLocation = async () => {
    setLoading(true);
    setError("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log("[Meteo] user (localStorage):", storedUser);

      // 1) Ville dans l'utilisateur enregistré
      let city = extractCity(storedUser);

      // 2) Sinon, on redemande l'utilisateur connecté au serveur
      if (!city && token) {
        try {
          const me = await axios.get("/api/auth/me", { headers });
          console.log("[Meteo] /auth/me:", me.data);
          city = extractCity(me.data?.user ?? me.data?.data ?? me.data);
        } catch (e) {
          console.log("[Meteo] /auth/me indisponible");
        }
      }

      // 3) Sinon, on cherche dans la liste des producteurs
      const producteurId = storedUser?.producteur_id;
      if (!city && producteurId) {
        try {
          const resAll = await axios.get("/api/v1/producteurs", { headers });
          const list = resAll.data?.data ?? resAll.data ?? [];
          const p = Array.isArray(list)
            ? list.find((x) => String(x.id) === String(producteurId))
            : null;
          city = extractCity(p);
        } catch (e) {
          // on continue
        }
      }

      // 4) Toujours rien : GPS
      if (!city) {
        console.log("[Meteo] aucune ville trouvée -> GPS");
        fallbackByGPS();
        return;
      }

      console.log("[Meteo] ville utilisée:", city);

      try {
        const res = await axios.get("/api/v1/meteo", { params: { ville: city } });
        console.log("[Meteo] réponse /api/v1/meteo:", res.data);

        if (!res.data?.temperature || res.data.temperature === "--") {
          fallbackByGPS();
          return;
        }

        setMeteo({ ...res.data, ville: res.data?.ville || city });
        setLoading(false);
      } catch (e) {
        // Ville inconnue de l'API météo -> GPS
        console.log("[Meteo] ville non reconnue:", city);
        fallbackByGPS();
      }
    } catch (err) {
      console.log(err);
      setError("Erreur lors de la récupération météo");
      setLoading(false);
    }
  };

  // Recherche météo par nom de ville (utile pour l'admin)
  const chercherVille = async (e) => {
    e?.preventDefault();
    const city = villeSaisie.trim();
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get("/api/v1/meteo", { params: { ville: city } });
      setMeteo({ ...res.data, ville: res.data?.ville || city });
    } catch (err) {
      setMeteo(null);
      setError(
        err?.response?.status === 404
          ? `Ville introuvable : ${city}`
          : "Erreur lors de la récupération météo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow p-6 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${carte})` }}
    >
      {/* Voile sombre pour garder le texte lisible */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative space-y-4">
        <h2 className="text-xl font-bold"> Météo locale</h2>

        <form onSubmit={chercherVille} className="flex gap-2">
          <input
            type="text"
            value={villeSaisie}
            onChange={(e) => setVilleSaisie(e.target.value)}
            placeholder="Ville (ex : Bobo-Dioulasso)"
            className="flex-1 px-3 py-2 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Voir
          </button>
        </form>

        <button
          type="button"
          onClick={getLocation}
          className="text-sm underline text-white/80 hover:text-white"
        >
          Ou utiliser ma position / ma ville
        </button>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-300">{error}</p>}

        {meteo && (
          <div className="space-y-2">
            <p><strong>Ville :</strong> {meteo.ville}</p>
            <p><strong>Température :</strong> {meteo.temperature}</p>
            <p>
              <strong>Min / Max :</strong> {meteo.temperature_min} / {meteo.temperature_max}
            </p>
            <p><strong>Climat :</strong> {meteo.description}</p>
            <p><strong>Humidité :</strong> {meteo.humidite}</p>
            <p><strong>Vent :</strong> {meteo.vent}</p>
            <p>
              <strong>Pluie probable :</strong> {meteo.pluie_probable}
              {meteo.pluie_probabilite ? ` (${meteo.pluie_probabilite})` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
