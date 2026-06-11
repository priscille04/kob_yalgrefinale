import { useState } from "react";
import axios from "axios";

export default function Meteo() {
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;
  // Debug : permet de voir si VITE_WEATHER_KEY est bien injectée par Vite
  console.log("[Meteo] VITE_WEATHER_KEY:", API_KEY);

  const getLocation = async () => {
    if (!API_KEY) {
      setError("Clé météo manquante. Vérifie VITE_WEATHER_KEY dans .env");
      return;
    }

    setLoading(true);
    setError("");
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

            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
            );

            setMeteo(res.data);
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

    try {
     
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const producteurId = storedUser?.producteur_id;

      if (!producteurId) {
        fallbackByGPS();
        return;
      }

     
      const token = localStorage.getItem("token");
      let city = "";

      try {
        const resAll = await axios.get("/api/v1/producteurs", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        const list = resAll.data?.data ?? resAll.data ?? [];
        const p = Array.isArray(list)
          ? list.find((x) => String(x.id) === String(producteurId))
          : null;

        city = p?.boutique?.ville || p?.boutique?.ville || p?.localisation || "";
      } catch (e) {
        
      }

      if (!city) {
        fallbackByGPS();
        return;
      }

      
      console.log("[Meteo] ville utilisée:", city);
      const res = await axios.get("/api/v1/meteo", {
        params: { ville: city },
      });

      console.log("[Meteo] response /api/v1/meteo (brut):", res.data);
    
      const villeLabel = String(res.data?.ville ?? city ?? "").trim();


      if (!res.data?.temperature || res.data?.temperature === '--') {
        
        fallbackByGPS();
        return;
      }


      const tempRaw = res.data?.temperature;
      const tempStr = typeof tempRaw === "string" ? tempRaw : String(tempRaw ?? "0");
      const tempNum = parseFloat(tempStr.replace("°C", ""));

      // On normalise pour garder l'UI actuelle.
      setMeteo({
        name: villeLabel,
        main: { temp: Number.isFinite(tempNum) ? tempNum : 0, humidity: res.data?.humidite || 0 },
        weather: [{ description: res.data?.description || "" }],
      });
    } catch (err) {
      console.log(err);
      setError("Erreur lors de la récupération météo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">

      <h2 className="text-xl font-bold text-green-700"> Météo locale</h2>

      <button
        onClick={getLocation}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
         Obtenir ma météo
      </button>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {meteo && (
        <div className="space-y-2">
          <p><strong>Température :</strong> {meteo.main.temp} °C</p>
          <p><strong>Climat :</strong> {meteo.weather[0].description}</p>
          <p><strong>Humidité :</strong> {meteo.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}