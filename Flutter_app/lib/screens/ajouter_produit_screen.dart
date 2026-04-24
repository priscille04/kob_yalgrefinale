import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

class AjouterProduitScreen extends StatefulWidget {
  final Function onSaved;
  const AjouterProduitScreen({super.key, required this.onSaved});

  @override
  State<AjouterProduitScreen> createState() => _AjouterProduitScreenState();
}

class _AjouterProduitScreenState extends State<AjouterProduitScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nomCtrl = TextEditingController();
  final _prixCtrl = TextEditingController();
  final _quantiteCtrl = TextEditingController();
  File? _image;
  bool _loading = false;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() => _image = File(picked.path));
    }
  }
  Future<void> _save() async {
  if (_formKey.currentState!.validate()) {
    setState(() => _loading = true);
    try {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final producteurId = auth.producteurId;
      if (producteurId == null) {
        throw Exception('Vous devez être connecté en tant que producteur pour ajouter un produit.');
      }
      await ApiService.addProduit(
        nom: _nomCtrl.text,
        prix: double.parse(_prixCtrl.text),
        quantite: int.parse(_quantiteCtrl.text),
        producteurId: producteurId,
        image: _image,
      );
      widget.onSaved(); // recharge la liste
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erreur: $e")),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ajouter un produit")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nomCtrl,
                decoration: const InputDecoration(labelText: "Nom du produit"),
                validator: (v) => v!.isEmpty ? "Champ obligatoire" : null,
              ),
              TextFormField(
                controller: _prixCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Prix"),
                validator: (v) => v!.isEmpty ? "Champ obligatoire" : null,
              ),
              TextFormField(
                controller: _quantiteCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Quantité"),
                validator: (v) => v!.isEmpty ? "Champ obligatoire" : null,
              ),
              const SizedBox(height: 16),
              _image == null
                  ? TextButton.icon(
                      onPressed: _pickImage,
                      icon: const Icon(Icons.photo),
                      label: const Text("Choisir une image"),
                    )
                  : Image.file(_image!, height: 150),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : _save,
                child: _loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Enregistrer"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
