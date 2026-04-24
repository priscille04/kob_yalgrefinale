import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MeteoScreen extends StatefulWidget {
  final double? latitude;
  final double? longitude;

  const MeteoScreen({super.key, this.latitude, this.longitude});

  @override
  State<MeteoScreen> createState() => _MeteoScreenState();
}

class _MeteoScreenState extends State<MeteoScreen> {
  final _villeCtrl = TextEditingController(text: 'Ouagadougou');
  Map<String, dynamic>? _meteo;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Si des coordonnées sont fournies, utiliser la localisation
    if (widget.latitude != null && widget.longitude != null) {
      _loadByLocation();
    } else {
      _load();
    }
  }

  Future<void> _load() async {
    if (_villeCtrl.text.trim().isEmpty) return;
    setState(() {
      _loading = true;
      _error = null;
    });

    final data = await ApiService.getMeteo(_villeCtrl.text.trim());

    if (!mounted) return;
    if (data != null) {
      setState(() {
        _meteo = data;
        _loading = false;
      });
    } else {
      setState(() {
        _error = 'Impossible de charger la météo';
        _loading = false;
      });
    }
  }

  Future<void> _loadByLocation() async {
    if (widget.latitude == null || widget.longitude == null) return;

    setState(() {
      _loading = true;
      _error = null;
      _villeCtrl.text = 'Votre position';
    });

    final data = await ApiService.getMeteoByCoords(
      widget.latitude!,
      widget.longitude!,
    );

    if (!mounted) return;
    if (data != null) {
      setState(() {
        _meteo = data;
        _loading = false;
      });
    } else {
      setState(() {
        _error = 'Impossible de charger la météo pour votre position';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _villeCtrl,
                  decoration: InputDecoration(
                    hintText: 'Ville...',
                    prefixIcon: const Icon(Icons.location_on),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  onSubmitted: (_) => _load(),
                ),
              ),
              const SizedBox(width: 8),
              SizedBox(
                height: 48,
                child: ElevatedButton(
                  onPressed: _loading ? null : _load,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade600,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Icon(Icons.search),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          if (_loading) const CircularProgressIndicator(),

          if (_error != null)
            Text(_error!, style: const TextStyle(color: Colors.red)),

          if (_meteo != null && !_loading) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue.shade400, Colors.blue.shade700],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  Text(
                    _meteo!['ville'] ?? 'Ville inconnue',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${_meteo!['temperature'] ?? 0}°C',
                        style: const TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        _meteo!['description'] ?? 'Description inconnue',
                        style: const TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildWeatherInfo('Humidité', '${_meteo!['humidite'] ?? 0}%'),
                      _buildWeatherInfo('Vent', '${_meteo!['vent'] ?? 0} km/h'),
                      _buildWeatherInfo('Pression', '${_meteo!['pression'] ?? 0} hPa'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildWeatherInfo(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.white.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }
}
