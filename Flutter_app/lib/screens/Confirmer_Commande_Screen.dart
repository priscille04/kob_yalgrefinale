import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';

class Confirmer_CommandeScreen extends StatefulWidget {
  final List<Map<String, dynamic>> panier;

  const Confirmer_CommandeScreen({
    super.key,
    required this.panier,
  });

  @override
  State<Confirmer_CommandeScreen> createState() =>
      _Confirmer_CommandeScreenState();
}

class _Confirmer_CommandeScreenState extends State<Confirmer_CommandeScreen> {
  bool _loading = false;

  double get total {
    double sum = 0;
    for (final item in widget.panier) {
      final prix = _toDouble(item['prix']);
      final qte = _toInt(item['quantite_choisie'] ?? item['quantite'] ?? 1);
      sum += prix * qte;
    }
    return sum;
  }

  double _toDouble(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0;
  }

  int _toInt(dynamic value) {
    if (value == null) return 1;
    if (value is int) return value;
    if (value is num) return value.toInt();
    return int.tryParse(value.toString()) ?? 1;
  }

  Future<void> _validerCommande() async {
    final auth = context.read<AuthProvider>();
    final cart = context.read<CartProvider>();

    if (auth.clientId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vous devez être connecté')),
      );
      return;
    }

    setState(() => _loading = true);

    try {
      // Envoi d'une commande par produit
      for (final item in widget.panier) {
        await ApiService.createCommande(
          clientId: auth.clientId!,
          produitId: item['id'],
          quantite: _toInt(item['quantite_choisie'] ?? item['quantite'] ?? 1),
        );
      }

      // Vider le panier
      cart.vider();

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Commande validée avec succès'),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.popUntil(context, (route) => route.isFirst);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e')),
      );
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final panier = widget.panier;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirmer la commande'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: panier.isEmpty
          ? const Center(child: Text('Aucun produit dans le panier'))
          : Column(
              children: [
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: panier.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = panier[index];
                      final prix = _toDouble(item['prix']);
                      final qte =
                          _toInt(item['quantite_choisie'] ?? item['quantite'] ?? 1);
                      final sousTotal = prix * qte;

                      return Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.grey.shade200),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 6,
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item['nom']?.toString() ?? 'Produit',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              '${prix.toStringAsFixed(0)} FCFA × $qte',
                              style: TextStyle(color: Colors.grey.shade600),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Sous-total : ${sousTotal.toStringAsFixed(0)} FCFA',
                              style: TextStyle(
                                color: Colors.green.shade700,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // Total + bouton
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(
                      top: BorderSide(color: Colors.grey.shade300),
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Montant total',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '${total.toStringAsFixed(0)} FCFA',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.green.shade700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${panier.length} produit${panier.length > 1 ? 's' : ''}',
                        style: TextStyle(color: Colors.grey.shade600),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: _loading ? null : _validerCommande,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade600,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: _loading
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Text(
                                  'Valider et payer',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}