import 'package:flutter/material.dart';
import 'producteur_dashboard.dart';

/// Écran wrapper pour les producteurs - redirection vers le dashboard
class ProducteurScreen extends StatelessWidget {
  final Map<String, dynamic>? producteur;

  const ProducteurScreen({super.key, this.producteur});

  @override
  Widget build(BuildContext context) {
    return ProducteurDashboard(producteur: producteur);
  }
}

// Cette classe n'est plus utilisée mais gardée pour compatibilité
class _ProducteurScreenOld extends StatefulWidget {
  //final Map<String, dynamic>? producteur;

  //const _ProducteurScreenOld({super.key, this.producteur});

  @override
  State<_ProducteurScreenOld> createState() => _ProducteurScreenState();
}

class _ProducteurScreenState extends State<_ProducteurScreenOld> {
  @override
  Widget build(BuildContext context) {
    // This class is deprecated - use ProducteurDashboard instead
    return const Scaffold(
      body: Center(
        child: Text('Page dépréciée - veuillez vous reconnecter'),
      ),
    );
  }
}

