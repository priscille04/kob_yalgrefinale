import 'package:flutter/material.dart';
// ignore: unused_import
import '../providers/auth_provider.dart';
import 'producteur_dashboard.dart';

/// Écran de profil producteur - redirection vers le dashboard
class ProducteurScreenFinal extends StatelessWidget {
  final Map<String, dynamic>? producteur;

  const ProducteurScreenFinal({super.key, this.producteur});

  @override
  Widget build(BuildContext context) {
    return ProducteurDashboard(producteur: producteur);
  }
}
