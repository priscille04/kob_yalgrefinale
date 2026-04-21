import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MeteoScreen extends StatefulWidget {
  const MeteoScreen({super.key});

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
    _load();
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
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  Text(
                    _meteo!['ville'] ?? '',
                    style: const TextStyle(color: Colors.white, fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _meteo!['temperature'] ?? '--',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (_meteo!['description'] != null &&
                      _meteo!['description'] != '')
                    Text(
                      _meteo!['description'],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  if (_meteo!['source'] == 'offline')
                    Container(
                      margin: const EdgeInsets.only(top: 12),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Mode hors-ligne',
                        style: TextStyle(color: Colors.white, fontSize: 12),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            Row(
              children: [
                _meteoCard(
                  Icons.water_drop,
                  'Humidité',
                  _meteo!['humidite'] ?? '--',
                ),
                const SizedBox(width: 12),
                _meteoCard(Icons.air, 'Vent', _meteo!['vent'] ?? '--'),
                const SizedBox(width: 12),
                _meteoCard(
                  Icons.umbrella,
                  'Pluie',
                  _meteo!['pluie_probable'] ?? '--',
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _meteoCard(IconData icon, String label, String value) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(13),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.blue.shade400, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              label,
              style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}
