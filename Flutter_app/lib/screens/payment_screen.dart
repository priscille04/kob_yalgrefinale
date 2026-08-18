import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'commandes_screen.dart';

class PaymentScreen extends StatefulWidget {
  final Map<String, dynamic> produit;
  final int quantite;

  const PaymentScreen({
    super.key,
    required this.produit,
    required this.quantite,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  bool _isLoading = false;
  String? _selectedMethod;

  Future<void> _processPayment() async {
    if (_selectedMethod == null) return;

    setState(() => _isLoading = true);

    final auth = context.read<AuthProvider>();

    final result = await ApiService.createCommande(
      clientId: auth.clientId!,
      produitId: widget.produit['id'],
      quantite: widget.quantite,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result['_success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Commande créée avec succès !'), backgroundColor: Colors.green),
      );

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const CommandesScreen()),
        (route) => route.isFirst,
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Erreur'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final prix = (widget.produit['prix'] is String 
        ? double.tryParse(widget.produit['prix']) 
        : widget.produit['prix'] as num?) ?? 0;
    final total = prix * widget.quantite;

    return Scaffold(
      appBar: AppBar(title: const Text('Paiement'), backgroundColor: Colors.green),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text(widget.produit['nom'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text('Quantité: ${widget.quantite}'),
                    Text('Total: $total FCFA', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.green)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
            const Text('Moyen de paiement', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildPaymentOption('orange', 'Orange Money'),
            _buildPaymentOption('moov', 'Moov Money'),
            _buildPaymentOption('wave', 'Wave'),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _selectedMethod != null && !_isLoading ? _processPayment : null,
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green.shade600),
                child: _isLoading 
                    ? const CircularProgressIndicator(color: Colors.white) 
                    : const Text('Confirmer le paiement', style: TextStyle(fontSize: 17)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentOption(String value, String title) {
    return RadioListTile<String>(
      title: Text(title),
      value: value,
      groupValue: _selectedMethod,
      onChanged: (val) => setState(() => _selectedMethod = val),
    );
  }
}