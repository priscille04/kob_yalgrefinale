import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PlayCircle, Loader2, Eye } from "lucide-react";

export default function ConseilsProducteur() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/v1/conseils?all=true");

      setVideos(data || []);

    } catch (err) {
      console.log("Erreur videos:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">
        Conseils Agricoles
      </h1>

      <div className="space-y-4">

        {videos.length === 0 ? (
          <p className="text-gray-500">Aucune vidéo disponible</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow overflow-hidden">

              {/* IMAGE / PREVIEW */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <PlayCircle className="w-14 h-14 text-green-600" />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2">

                <h2 className="font-bold text-lg">
                  {video.titre}
                </h2>

                <p className="text-gray-600 text-sm">
                  {video.description}
                </p>

                {/* INFO STYLE FLUTTER */}
                <div className="flex justify-between text-sm text-gray-500 mt-2">

                  <div className="flex items-center gap-1">
                    ⏱ {video.duree || "10:00"}
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {video.vues || 0}
                  </div>

                </div>

                {/* BUTTON PLAY */}
                {video.lien && (
                  <a
                    href={video.lien}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-green-600 font-medium"
                  >
                    ▶ Voir la vidéo
                  </a>
                )}

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}