import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'chat_screen.dart';

class ProduitDetailScreen extends StatefulWidget {
  final Map<String, dynamic> produit;
  const ProduitDetailScreen({super.key, required this.produit});

  @override
  State<ProduitDetailScreen> createState() => _ProduitDetailScreenState();
}

class _ProduitDetailScreenState extends State<ProduitDetailScreen> {
  int _selectedTabIndex = 0; // 0: Description, 1: Commande

  @override
  Widget build(BuildContext context) {
    final produit = widget.produit;
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
      body: Column(
        children: [
          // Tab buttons
          Container(
            color: Colors.grey.shade100,
            child: Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedTabIndex = 0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: _selectedTabIndex == 0
                                ? Colors.green.shade600
                                : Colors.transparent,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'Description',
                          style: TextStyle(
                            fontWeight: _selectedTabIndex == 0
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: _selectedTabIndex == 0
                                ? Colors.green.shade600
                                : Colors.grey,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedTabIndex = 1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: _selectedTabIndex == 1
                                ? Colors.green.shade600
                                : Colors.transparent,
                            width: 3,
                          ),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'Commande',
                          style: TextStyle(
                            fontWeight: _selectedTabIndex == 1
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: _selectedTabIndex == 1
                                ? Colors.green.shade600
                                : Colors.grey,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Content
          Expanded(
            child: _selectedTabIndex == 0
                ? _buildDescriptionTab(produit, producteur, type, imageUrl)
                : _buildOrderTab(produit),
          ),
          // Bottom action buttons
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey.shade300),
              ),
              color: Colors.white,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () => _showOrderDialog(context),
                    icon: const Icon(Icons.shopping_cart),
                    label: const Text('Commander',
                        style: TextStyle(fontSize: 16)),
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
                      onPressed: () =>
                          _contactProducteur(context, producteurId),
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
        ],
      ),
    );
  }

  Widget _buildDescriptionTab(Map<String, dynamic> produit, String producteur,
      String type, String imageUrl) {
    return SingleChildScrollView(
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
                      errorBuilder: (_, _, _) => Icon(
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
            style: Theme.of(context)
                .textTheme
                .headlineSmall
                ?.copyWith(fontWeight: FontWeight.bold),
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
                  '${(produit['prix'] is String ? double.tryParse(produit['prix']) : produit['prix'])?.toStringAsFixed(0) ?? '0'} FCFA',
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
        ],
      ),
    );
  }

  Widget _buildOrderTab(Map<String, dynamic> produit) {
    final auth = context.read<AuthProvider>();
    
    // Check if user is a client
    if (auth.role != 'client' || auth.clientId == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.lock,
                size: 64,
                color: Colors.grey.shade400,
              ),
              const SizedBox(height: 16),
              Text(
                'Seuls les clients peuvent passer des commandes',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.blue.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'En attente',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Confirmez votre commande pour ce produit',
                  style: TextStyle(
                    color: Colors.grey.shade700,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Détails de la commande',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                _detailRow('Produit', produit['nom'] ?? ''),
                const Divider(),
                _detailRow(
                  'Prix unitaire',
                  '${(produit['prix'] is String ? double.tryParse(produit['prix']) : produit['prix'])?.toStringAsFixed(0) ?? '0'} FCFA',
                ),
                const Divider(),
                _detailRow('Stock disponible', '${produit['quantite'] ?? 0}'),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          Text(
            value,
            style: TextStyle(color: Colors.grey.shade700),
          ),
        ],
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
        produitId: widget.produit['id'],
      );

      if (!context.mounted) return;

      if (result['_success'] == true) {
        final conv = result['conversation'] ?? result;
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ChatScreen(
              conversationId: conv['id'],
              contactNom:
                  widget.produit['producteur']?['nom'] ?? 'Producteur',
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
            Text('${widget.produit['nom']}'),
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
                produitId: widget.produit['id'],
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
