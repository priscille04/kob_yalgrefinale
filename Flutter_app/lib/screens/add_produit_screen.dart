import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AddProduitScreen extends StatefulWidget {
  const AddProduitScreen({super.key});

  @override
  State<AddProduitScreen> createState() => _AddProduitScreenState();
}

class _AddProduitScreenState extends State<AddProduitScreen> {

  final TextEditingController nomController = TextEditingController();
  final TextEditingController quantiteController = TextEditingController();
  final TextEditingController prixController = TextEditingController();
  final TextEditingController producteurIdController = TextEditingController();

  bool isLoading = false;

  Future<void> ajouterProduit() async {
    // Validation des champs
    if (nomController.text.trim().isEmpty ||
        quantiteController.text.trim().isEmpty ||
        prixController.text.trim().isEmpty ||
        producteurIdController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Veuillez remplir tous les champs")),
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final success = await ApiService.addProduit(
        nom: nomController.text.trim(),
        quantite: int.parse(quantiteController.text),
        prix: double.parse(prixController.text),
        producteurId: int.parse(producteurIdController.text),
      );

      if (!mounted) return; //  FIX IMPORTANT

      setState(() {
        isLoading = false;
      });

      if (success) {
        nomController.clear();
        quantiteController.clear();
        prixController.clear();
        producteurIdController.clear();

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Produit ajouté avec succès")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Erreur lors de l'ajout")),
        );
      }
    } catch (e) {
      if (!mounted) return;

      setState(() {
        isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ajouter Produit")),

      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [

            TextField(
              controller: nomController,
              decoration: const InputDecoration(labelText: "Nom du produit"),
            ),

            TextField(
              controller: quantiteController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Quantité"),
            ),

            TextField(
              controller: prixController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Prix"),
            ),

            TextField(
              controller: producteurIdController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "ID du Producteur"),
            ),

            const SizedBox(height: 20),

            isLoading
                ? const CircularProgressIndicator()
                : SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: ajouterProduit,
                      child: const Text("Ajouter le produit"),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}