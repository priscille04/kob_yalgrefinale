import { useState } from "react";
import axios from "axios";

export default function Meteo() {
  const [meteo, setMeteo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;
console.log("API KEY =", import.meta.env.VITE_WEATHER_KEY);
  const getLocation = () => {
    setLoading(true);
    setError("");

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
          <p><strong>Ville :</strong> {meteo.name}</p>
          <p><strong>Température :</strong> {meteo.main.temp} °C</p>
          <p><strong>Climat :</strong> {meteo.weather[0].description}</p>
          <p><strong>Humidité :</strong> {meteo.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}