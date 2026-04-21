import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AnnoncesScreen extends StatefulWidget {
  const AnnoncesScreen({super.key});

  @override
  State<AnnoncesScreen> createState() => _AnnoncesScreenState();
}

class _AnnoncesScreenState extends State<AnnoncesScreen> {
  List<dynamic> _annonces = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final data = await ApiService.getAnnonces();
    if (!mounted) return;
    setState(() {
      _annonces = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_annonces.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.campaign_outlined,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 12),
            Text(
              'Aucune annonce',
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: _annonces.length,
        itemBuilder: (_, i) {
          final a = _annonces[i];
          final producteur =
              a['producteur']?['utilisateur']?['nom'] ?? 'Anonyme';

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.campaign,
                        color: Colors.orange.shade600,
                        size: 22,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          a['titre'] ?? 'Sans titre',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    a['contenu'] ?? a['description'] ?? '',
                    style: TextStyle(color: Colors.grey.shade700, height: 1.4),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Icon(Icons.person, size: 16, color: Colors.grey.shade500),
                      const SizedBox(width: 4),
                      Text(
                        producteur,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      const Spacer(),
                      if (a['created_at'] != null)
                        Text(
                          _formatDate(a['created_at']),
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade500,
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _formatDate(String date) {
    try {
      final d = DateTime.parse(date);
      return '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';
    } catch (_) {
      return date;
    }
  }
}
