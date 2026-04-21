import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'add_produit_screen.dart';

class ProduitScreen extends StatefulWidget {
  const ProduitScreen({super.key});

  @override
  State<ProduitScreen> createState() => _ProduitScreenState();
}

class _ProduitScreenState extends State<ProduitScreen> {

  List<dynamic> produits = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadProduits();
  }

  //  CHARGER PRODUITS
  Future<void> loadProduits() async {
    final data = await ApiService.getProduits();

    setState(() {
      produits = data;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Produits"),
        backgroundColor: Colors.green,
      ),

      // ➕ bouton ajouter
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.green,
        child: const Icon(Icons.add),
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AddProduitScreen(),
            ),
          );

          loadProduits(); // refresh
        },
      ),

      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : produits.isEmpty
              ? const Center(
                  child: Text(
                    "Aucun produit trouvé",
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : ListView.builder(
                  itemCount: produits.length,
                  itemBuilder: (context, index) {
                    final p = produits[index];

                    return Card(
                      margin: const EdgeInsets.all(10),
                      child: ListTile(
                        leading: const Icon(Icons.shopping_bag),
                        title: Text(p['nom'] ?? "Sans nom"),
                        subtitle: Text(
                          "Prix: ${p['prix']} FCFA | Qté: ${p['quantite']}",
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}