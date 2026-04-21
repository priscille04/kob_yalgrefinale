<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MeteoController extends Controller
{
    public function getByVille(Request $request)
    {
        $request->validate([
            'ville' => 'required|string|max:255',
        ]);

        $apiKey = config('services.openweather.key');
        $ville = $request->ville;

        if (!$apiKey) {
            return response()->json([
                'message' => 'Clé API OpenWeather non configurée',
                'ville' => $ville,
                'temperature' => '--',
                'pluie_probable' => '--',
                'vent' => '--',
                'humidite' => '--',
                'description' => 'Service météo indisponible',
                'source' => 'offline',
            ], 200);
        }

        try {
            $response = Http::timeout(5)->get('https://api.openweathermap.org/data/2.5/weather', [
                'q' => $ville . ',BF',
                'appid' => $apiKey,
                'units' => 'metric',
                'lang' => 'fr',
            ]);

            if ($response->failed()) {
                return response()->json(['message' => 'Ville introuvable ou API indisponible'], 404);
            }

            $data = $response->json();

            return response()->json([
                'ville' => $ville,
                'temperature' => round($data['main']['temp'] ?? 0, 1) . '°C',
                'temperature_min' => round($data['main']['temp_min'] ?? 0, 1) . '°C',
                'temperature_max' => round($data['main']['temp_max'] ?? 0, 1) . '°C',
                'humidite' => ($data['main']['humidity'] ?? 0) . '%',
                'vent' => round($data['wind']['speed'] ?? 0, 1) . ' km/h',
                'pluie_probable' => isset($data['rain']) ? 'Oui' : 'Non',
                'description' => $data['weather'][0]['description'] ?? '',
                'icone' => $data['weather'][0]['icon'] ?? '',
                'source' => 'openweather',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur de connexion au service météo',
                'ville' => $ville,
                'source' => 'error',
            ], 503);
        }
    }

    public function previsions(Request $request)
    {
        $request->validate([
            'ville' => 'required|string|max:255',
        ]);

        $apiKey = config('services.openweather.key');
        $ville = $request->ville;

        if (!$apiKey) {
            return response()->json([
                'message' => 'Clé API OpenWeather non configurée',
                'source' => 'offline',
            ], 200);
        }

        try {
            $response = Http::timeout(5)->get('https://api.openweathermap.org/data/2.5/forecast', [
                'q' => $ville . ',BF',
                'appid' => $apiKey,
                'units' => 'metric',
                'lang' => 'fr',
                'cnt' => 40,
            ]);

            if ($response->failed()) {
                return response()->json(['message' => 'Ville introuvable'], 404);
            }

            $data = $response->json();
            $previsions = collect($data['list'] ?? [])->map(fn($item) => [
                'date' => $item['dt_txt'],
                'temperature' => round($item['main']['temp'], 1),
                'humidite' => $item['main']['humidity'],
                'vent' => round($item['wind']['speed'], 1),
                'description' => $item['weather'][0]['description'] ?? '',
                'icone' => $item['weather'][0]['icon'] ?? '',
                'pluie' => $item['rain']['3h'] ?? 0,
            ]);

            return response()->json([
                'ville' => $ville,
                'previsions' => $previsions,
                'source' => 'openweather',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur de connexion'], 503);
        }
    }
}
