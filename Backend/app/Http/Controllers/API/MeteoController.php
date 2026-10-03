<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class MeteoController extends Controller
{
    private const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
    private const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

    /** Seuil (%) de probabilité de pluie à partir duquel on répond "Oui" */
    private const SEUIL_PLUIE = 40;

    // ------------------------------------------------------------------
    // GET /v1/meteo?ville=...
    // ------------------------------------------------------------------
    public function getByVille(Request $request)
    {
        $request->validate([
            'ville' => 'required|string|max:255',
        ]);

        $ville = trim($request->ville);

        try {
            $lieu = $this->geocode($ville);

            if (!$lieu) {
                return response()->json(['message' => 'Ville introuvable ou API indisponible'], 404);
            }

            $data = $this->fetchCurrent($lieu['latitude'], $lieu['longitude']);

            if (!$data) {
                return response()->json(['message' => 'Ville introuvable ou API indisponible'], 404);
            }

            // Normalisation province/région -> ville principale
            $villeFinale = $lieu['name'] ?? $ville;
            $mapping = [
                'kadiogo' => 'Ouagadougou',
            ];
            if (isset($mapping[strtolower($villeFinale)])) {
                $villeFinale = $mapping[strtolower($villeFinale)];
            }

            return response()->json($this->formatCurrent($data, $villeFinale, false));

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur de connexion au service météo',
                'ville' => $ville,
                'source' => 'error',
            ], 503);
        }
    }

    // ------------------------------------------------------------------
    // GET /v1/meteo/coords?lat=...&lon=...
    // ------------------------------------------------------------------
    public function getByCoords(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lon' => 'required|numeric|between:-180,180',
        ]);

        try {
            $data = $this->fetchCurrent((float) $request->lat, (float) $request->lon);

            if (!$data) {
                return response()->json(['message' => 'Position introuvable ou API indisponible'], 404);
            }

            // Open-Meteo ne fait pas de géocodage inverse : nom générique
            return response()->json($this->formatCurrent($data, 'Position actuelle', true));

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur de connexion au service météo',
                'ville' => 'Position actuelle',
                'source' => 'error',
            ], 503);
        }
    }

    // ------------------------------------------------------------------
    // GET /v1/meteo/previsions?ville=...
    // Même format qu'avant : un point toutes les 3 heures sur 5 jours
    // ------------------------------------------------------------------
    public function previsions(Request $request)
    {
        $request->validate([
            'ville' => 'required|string|max:255',
        ]);

        $ville = trim($request->ville);

        try {
            $lieu = $this->geocode($ville);

            if (!$lieu) {
                return response()->json(['message' => 'Ville introuvable'], 404);
            }

            $response = Http::timeout(8)->get(self::FORECAST_URL, [
                'latitude' => $lieu['latitude'],
                'longitude' => $lieu['longitude'],
                'hourly' => 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation,is_day',
                'wind_speed_unit' => 'kmh',
                'timezone' => 'auto',
                'forecast_days' => 5,
            ]);

            if ($response->failed()) {
                return response()->json(['message' => 'Ville introuvable'], 404);
            }

            $h = $response->json('hourly');
            $total = count($h['time'] ?? []);
            $previsions = [];

            // On garde 1 point sur 3 (comme OpenWeather)
            for ($i = 0; $i < $total; $i += 3) {
                // Pluie cumulée sur le bloc de 3 heures
                $pluie = 0;
                for ($j = $i; $j < min($i + 3, $total); $j++) {
                    $pluie += $h['precipitation'][$j] ?? 0;
                }

                [$description, $icone] = $this->decodeWeather(
                    $h['weather_code'][$i] ?? 0,
                    (bool) ($h['is_day'][$i] ?? 1)
                );

                $previsions[] = [
                    'date' => str_replace('T', ' ', $h['time'][$i]) . ':00',
                    'temperature' => round($h['temperature_2m'][$i] ?? 0, 1),
                    'humidite' => $h['relative_humidity_2m'][$i] ?? 0,
                    'vent' => round($h['wind_speed_10m'][$i] ?? 0, 1),
                    'description' => $description,
                    'icone' => $icone,
                    'pluie' => round($pluie, 1),
                ];
            }

            return response()->json([
                'ville' => $ville,
                'previsions' => $previsions,
                'source' => 'open-meteo',
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur de connexion'], 503);
        }
    }

    // ==================================================================
    // Méthodes privées
    // ==================================================================

    /**
     * Nom de ville -> coordonnées (limité au Burkina Faso, mis en cache 30 jours).
     */
    private function geocode(string $ville): ?array
    {
        $cle = 'meteo_geo_' . md5(mb_strtolower($ville));

        return Cache::remember($cle, now()->addDays(30), function () use ($ville) {
            $response = Http::timeout(5)->get(self::GEO_URL, [
                'name' => $ville,
                'count' => 1,
                'language' => 'fr',
                'countryCode' => 'BF',
            ]);

            if ($response->failed()) {
                return null;
            }

            return $response->json('results.0');
        });
    }

    /**
     * Météo actuelle + min/max + probabilité de pluie du jour (cache 10 min).
     */
    private function fetchCurrent(float $lat, float $lon): ?array
    {
        $cle = 'meteo_now_' . md5(round($lat, 2) . '_' . round($lon, 2));

        return Cache::remember($cle, now()->addMinutes(10), function () use ($lat, $lon) {
            $response = Http::timeout(8)->get(self::FORECAST_URL, [
                'latitude' => $lat,
                'longitude' => $lon,
                'current' => 'temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code,is_day,precipitation',
                'daily' => 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                'wind_speed_unit' => 'kmh',
                'timezone' => 'auto',
                'forecast_days' => 1,
            ]);

            return $response->failed() ? null : $response->json();
        });
    }

    /**
     * Construit la réponse JSON au même format qu'avant.
     */
    private function formatCurrent(array $data, string $ville, bool $avecPression): array
    {
        $cur = $data['current'] ?? [];
        $daily = $data['daily'] ?? [];

        [$description, $icone] = $this->decodeWeather(
            $cur['weather_code'] ?? 0,
            (bool) ($cur['is_day'] ?? 1)
        );

        $probaPluie = $daily['precipitation_probability_max'][0] ?? 0;
        $pleut = ($cur['precipitation'] ?? 0) > 0 || $probaPluie >= self::SEUIL_PLUIE;

        $result = [
            'ville' => $ville,
            'temperature' => round($cur['temperature_2m'] ?? 0, 1) . '°C',
            'temperature_min' => round($daily['temperature_2m_min'][0] ?? 0, 1) . '°C',
            'temperature_max' => round($daily['temperature_2m_max'][0] ?? 0, 1) . '°C',
            'humidite' => ($cur['relative_humidity_2m'] ?? 0) . '%',
            'vent' => round($cur['wind_speed_10m'] ?? 0, 1) . ' km/h',
        ];

        if ($avecPression) {
            $result['pression'] = round($cur['surface_pressure'] ?? 0) . ' hPa';
        }

        $result += [
            'pluie_probable' => $pleut ? 'Oui' : 'Non',
            'pluie_probabilite' => $probaPluie . '%', // nouveau champ bonus
            'description' => $description,
            'icone' => $icone,
            'source' => 'open-meteo',
        ];

        return $result;
    }

    /**
     * Code WMO (Open-Meteo) -> [description FR, code icône style OpenWeather].
     * On garde les codes d'icônes OpenWeather (01d, 10n...) pour ne rien
     * casser côté dashboard / app.
     */
    private function decodeWeather(int $code, bool $isDay): array
    {
        $map = [
            0  => ['Ciel dégagé', '01'],
            1  => ['Plutôt dégagé', '02'],
            2  => ['Partiellement nuageux', '03'],
            3  => ['Couvert', '04'],
            45 => ['Brouillard', '50'],
            48 => ['Brouillard givrant', '50'],
            51 => ['Bruine légère', '09'],
            53 => ['Bruine modérée', '09'],
            55 => ['Bruine dense', '09'],
            56 => ['Bruine verglaçante légère', '09'],
            57 => ['Bruine verglaçante dense', '09'],
            61 => ['Pluie faible', '10'],
            63 => ['Pluie modérée', '10'],
            65 => ['Pluie forte', '10'],
            66 => ['Pluie verglaçante légère', '10'],
            67 => ['Pluie verglaçante forte', '10'],
            71 => ['Neige faible', '13'],
            73 => ['Neige modérée', '13'],
            75 => ['Neige forte', '13'],
            77 => ['Grains de neige', '13'],
            80 => ['Averses faibles', '09'],
            81 => ['Averses modérées', '09'],
            82 => ['Averses violentes', '09'],
            85 => ['Averses de neige faibles', '13'],
            86 => ['Averses de neige fortes', '13'],
            95 => ['Orage', '11'],
            96 => ['Orage avec grêle légère', '11'],
            99 => ['Orage avec grêle forte', '11'],
        ];

        [$description, $icone] = $map[$code] ?? ['Conditions inconnues', '03'];

        return [$description, $icone . ($isDay ? 'd' : 'n')];
    }
}