import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'chat_screen.dart';

class ProduitDetailScreen extends StatelessWidget {
  final Map<String, dynamic> produit;
  const ProduitDetailScreen({super.key, required this.produit});

  @override
  Widget build(BuildContext context) {
    final prix =
        (produit['prix'] is String
                ? double.tryParse(produit['prix'])
                : produit['prix'])
            ?.toStringAsFixed(0) ??
        '0';
    final producteur =
        produit['producteur']?['utilisateur']?['nom'] ?? 'Inconnu';
    final producteurId = produit['producteur']?['id'];
    final type = produit['type_produit']?['nom'] ?? '';
    final imageUrl = ApiService.imageUrl(produit['image']);

    return Scaffold(
      appBar: AppBar(
        title: Text(produit['nom'] ?? 'Produit'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              height: 200,
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: imageUrl.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Icon(
                          Icons.eco,
                          size: 80,
                          color: Colors.green.shade300,
                        ),
                      ),
                    )
                  : Icon(Icons.eco, size: 80, color: Colors.green.shade300),
            ),
            const SizedBox(height: 20),

            Text(
              produit['nom'] ?? '',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green.shade600,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '$prix FCFA',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  'Stock: ${produit['quantite'] ?? 0}',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ],
            ),
            const SizedBox(height: 16),

            if (produit['description'] != null &&
                produit['description'].toString().isNotEmpty) ...[
              const Text(
                'Description',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
              ),
              const SizedBox(height: 4),
              Text(
                produit['description'],
                style: TextStyle(color: Colors.grey.shade700),
              ),
              const SizedBox(height: 16),
            ],

            _infoRow(Icons.person, 'Producteur', producteur),
            if (type.isNotEmpty) _infoRow(Icons.category, 'Type', type),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: () => _showOrderDialog(context),
                icon: const Icon(Icons.shopping_cart),
                label: const Text('Commander', style: TextStyle(fontSize: 16)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade600,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),

            if (producteurId != null)
              SizedBox(
                width: double.infinity,
                height: 48,
                child: OutlinedButton.icon(
                  onPressed: () => _contactProducteur(context, producteurId),
                  icon: const Icon(Icons.message),
                  label: const Text(
                    'Contacter le producteur',
                    style: TextStyle(fontSize: 16),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.green.shade600,
                    side: BorderSide(color: Colors.green.shade600),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey),
          const SizedBox(width: 8),
          Text('$label: ', style: const TextStyle(fontWeight: FontWeight.w500)),
          Expanded(
            child: Text(value, style: TextStyle(color: Colors.grey.shade700)),
          ),
        ],
      ),
    );
  }

  void _contactProducteur(BuildContext context, int producteurId) async {
    final auth = context.read<AuthProvider>();
    if (auth.role != 'client' || auth.clientId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Seuls les clients peuvent contacter un producteur'),
        ),
      );
      return;
    }

    try {
      final result = await ApiService.createConversation(
        clientId: auth.clientId!,
        producteurId: producteurId,
        produitId: produit['id'],
      );

      if (!context.mounted) return;

      if (result['_success'] == true) {
        final conv = result['conversation'] ?? result;
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ChatScreen(
              conversationId: conv['id'],
              contactNom: produit['producteur']?['nom'] ?? 'Producteur',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message'] ?? 'Erreur lors de la création'),
          ),
        );
      }
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Erreur de connexion')));
    }
  }

  void _showOrderDialog(BuildContext context) {
    final auth = context.read<AuthProvider>();
    if (auth.role != 'client' || auth.clientId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Seuls les clients peuvent commander')),
      );
      return;
    }

    final qteCtrl = TextEditingController(text: '1');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Commander'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('${produit['nom']}'),
            const SizedBox(height: 12),
            TextField(
              controller: qteCtrl,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Quantité',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade600,
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              final qte = int.tryParse(qteCtrl.text) ?? 0;
              if (qte <= 0) return;

              final result = await ApiService.createCommande(
                clientId: auth.clientId!,
                produitId: produit['id'],
                quantite: qte,
              );

              if (!ctx.mounted) return;
              Navigator.pop(ctx);

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    result['_success'] == true
                        ? 'Commande créée !'
                        : result['message'] ?? 'Erreur',
                  ),
                  backgroundColor: result['_success'] == true
                      ? Colors.green
                      : Colors.red,
                ),
              );
            },
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );
  }
}
