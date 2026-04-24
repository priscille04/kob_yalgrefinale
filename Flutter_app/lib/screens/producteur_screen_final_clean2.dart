import 'package:flutter/material.dart';

//import '../providers/auth_provider.dart';

class ProducteurScreen extends StatefulWidget {
  final Map<String, dynamic>? producteur;
  const ProducteurScreen({super.key, this.producteur});

  @override
  State<ProducteurScreen> createState() => _ProducteurScreenState();
}

class _ProducteurScreenState extends State<ProducteurScreen> {
  @override
  Widget build(BuildContext context) {
    final producteur = widget.producteur ?? {};
    final nom = producteur['utilisateur']?['nom'] ?? 'Producteur';
    final email = producteur['utilisateur']?['email'] ?? 'Email non disponible';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
          tooltip: 'Retour',
        ),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(
                Icons.person,
                color: Colors.green.shade600,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    nom,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    email,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: const Center(
        child: Text('Espace Producteur - Contenu à venir'),
      ),
    );
  }
}
