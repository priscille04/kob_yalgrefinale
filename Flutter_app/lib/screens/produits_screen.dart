import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'produit_detail_screen.dart';
import 'ajouter_produit_screen.dart';

class ProduitsScreen extends StatefulWidget {
  const ProduitsScreen({super.key});

  @override
  State<ProduitsScreen> createState() => _ProduitsScreenState();
}

class _ProduitsScreenState extends State<ProduitsScreen> {
  List<dynamic> _produits = [];
  bool _loading = true;
  final _searchCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load({String? search}) async {
    setState(() => _loading = true);
    final data = await ApiService.getProduits(search: search);
    if (!mounted) return;
    setState(() {
      _produits = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Produits")),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchCtrl,
              decoration: InputDecoration(
                hintText: 'Rechercher un produit...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchCtrl.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchCtrl.clear();
                          _load();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  vertical: 0,
                  horizontal: 16,
                ),
              ),
              onChanged: (_) => setState(() {}),
              onSubmitted: (v) => _load(search: v),
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _produits.isEmpty
                    ? const Center(
                        child: Text(
                          'Aucun produit trouvé',
                          style: TextStyle(color: Colors.grey),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () => _load(search: _searchCtrl.text),
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          itemCount: _produits.length,
                          itemBuilder: (_, i) {
                            final p = _produits[i];
                            final prix =
                                (p['prix'] is String
                                        ? double.tryParse(p['prix'])
                                        : p['prix'])
                                    ?.toStringAsFixed(0) ??
                                '0';
                            final producteur =
                                p['producteur']?['utilisateur']?['nom'] ?? '';

                            return Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: ListTile(
                                contentPadding: const EdgeInsets.all(12),
                                leading: Container(
                                  width: 50,
                                  height: 50,
                                  decoration: BoxDecoration(
                                    color: Colors.green.shade50,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: p['image'] != null &&
                                          p['image'].toString().isNotEmpty
                                      ? ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(10),
                                          child: Image.network(
                                            ApiService.imageUrl(p['image']),
                                            fit: BoxFit.cover,
                                            width: 50,
                                            height: 50,
                                            errorBuilder: (_, _, _) => Icon(
                                              Icons.eco,
                                              color: Colors.green.shade600,
                                            ),
                                          ),
                                        )
                                      : Icon(Icons.eco,
                                          color: Colors.green.shade600),
                                ),
                                title: Text(
                                  p['nom'] ?? '',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w600),
                                ),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const SizedBox(height: 4),
                                    Text(
                                        '$prix FCFA · Qté: ${p['quantite'] ?? 0}'),
                                    if (producteur.isNotEmpty)
                                      Text(
                                        producteur,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey.shade600,
                                        ),
                                      ),
                                  ],
                                ),
                                trailing: Icon(
                                  Icons.chevron_right,
                                  color: Colors.grey.shade400,
                                ),
                                onTap: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        ProduitDetailScreen(produit: p),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AjouterProduitScreen(onSaved: () => _load()),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
