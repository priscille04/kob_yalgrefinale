import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ConseilsScreen extends StatefulWidget {
  const ConseilsScreen({super.key});

  @override
  State<ConseilsScreen> createState() => _ConseilsScreenState();
}

class _ConseilsScreenState extends State<ConseilsScreen> {
  List<dynamic> _conseils = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final data = await ApiService.getConseils();
    if (!mounted) return;
    setState(() {
      _conseils = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());

    if (_conseils.isEmpty) {
      return const Center(
        child: Text(
          'Aucun conseil disponible',
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: _conseils.length,
        itemBuilder: (_, i) {
          final c = _conseils[i];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
            child: ExpansionTile(
              leading: Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.lightbulb, color: Colors.amber.shade700),
              ),
              title: Text(
                c['titre'] ?? '',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              children: [
                Text(
                  c['contenu'] ?? '',
                  style: TextStyle(color: Colors.grey.shade700, height: 1.5),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
