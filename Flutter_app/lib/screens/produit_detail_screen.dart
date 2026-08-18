import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../services/api_service.dart';
import 'chat_screen.dart';
import 'confirmer_Commande_screen.dart';
import 'panier_screen.dart'; // tu vas créer cet écran juste après

class ProduitDetailScreen extends StatefulWidget {
  final Map<String, dynamic> produit;
  const ProduitDetailScreen({super.key, required this.produit});

  @override
  State<ProduitDetailScreen> createState() => _ProduitDetailScreenState();
}

class _ProduitDetailScreenState extends State<ProduitDetailScreen> {
  int _selectedTabIndex = 0;
  int _quantite = 1;

  @override
  Widget build(BuildContext context) {
    final produit = widget.produit;
    final producteur =
        produit['producteur']?['utilisateur']?['nom'] ?? 'Inconnu';
    final producteurId = produit['producteur']?['id'];
    final type = produit['type_produit']?['nom'] ?? '';
    final imageUrl = ApiService.imageUrl(produit['image']);
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(produit['nom'] ?? 'Produit'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        actions: [
          // Badge panier
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const PanierScreen()),
                  );
                },
              ),
              if (cart.totalArticles > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${cart.totalArticles}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Tabs
          Container(
            color: Colors.grey.shade100,
            child: Row(
              children: [
                _buildTab('Description', 0),
                _buildTab('Commande', 1),
              ],
            ),
          ),

          Expanded(
            child: _selectedTabIndex == 0
                ? _buildDescriptionTab(produit, producteur, type, imageUrl)
                : _buildOrderTab(produit),
          ),

          // Boutons du bas
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade300)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Sélecteur de quantité
                Row(
                  children: [
                    const Text('Quantité :', style: TextStyle(fontWeight: FontWeight.w600)),
                    const Spacer(),
                    IconButton(
                      onPressed: _quantite > 1
                          ? () => setState(() => _quantite--)
                          : null,
                      icon: const Icon(Icons.remove_circle_outline),
                      color: Colors.green.shade700,
                    ),
                    Text(
                      '$_quantite',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      onPressed: () => setState(() => _quantite++),
                      icon: const Icon(Icons.add_circle_outline),
                      color: Colors.green.shade700,
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Bouton Ajouter au panier
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    onPressed: () => _ajouterAuPanier(context),
                    icon: const Icon(Icons.add_shopping_cart),
                    label: const Text(
                      'Ajouter au panier',
                      style: TextStyle(fontSize: 16),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade600,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Bouton Voir le panier
                if (cart.totalArticles > 0)
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const PanierScreen()),
                        );
                      },
                      icon: const Icon(Icons.shopping_bag_outlined),
                      label: Text(
                        'Voir le panier (${cart.totalArticles})',
                        style: const TextStyle(fontSize: 15),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.green.shade700,
                        side: BorderSide(color: Colors.green.shade600),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),

                if (producteurId != null) ...[
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: OutlinedButton.icon(
                      onPressed: () => _contactProducteur(context, producteurId),
                      icon: const Icon(Icons.message),
                      label: const Text('Contacter le producteur'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.green.shade700,
                        side: BorderSide(color: Colors.green.shade600),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(String label, int index) {
    final isSelected = _selectedTabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTabIndex = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? Colors.green.shade600 : Colors.transparent,
                width: 3,
              ),
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? Colors.green.shade600 : Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDescriptionTab(
    Map<String, dynamic> produit,
    String producteur,
    String type,
    String imageUrl,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            height: 220,
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
            style: Theme.of(context)
                .textTheme
                .headlineSmall
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                decoration: BoxDecoration(
                  color: Colors.green.shade600,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${_prix(produit).toStringAsFixed(0)} FCFA',
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
          const SizedBox(height: 18),
          if (produit['description'] != null &&
              produit['description'].toString().isNotEmpty) ...[
            const Text(
              'Description',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
            ),
            const SizedBox(height: 6),
            Text(
              produit['description'],
              style: TextStyle(color: Colors.grey.shade700, height: 1.4),
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

    if (auth.role != 'client' || auth.clientId == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.lock_outline, size: 64, color: Colors.grey.shade400),
              const SizedBox(height: 16),
              Text(
                'Seuls les clients peuvent passer des commandes',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
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
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.green.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ajouter au panier',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Colors.green.shade800,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Vous pouvez ajouter plusieurs produits avant de valider votre commande.',
                  style: TextStyle(color: Colors.grey.shade700, fontSize: 14),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Détails du produit',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              children: [
                _detailRow('Produit', produit['nom'] ?? ''),
                const Divider(),
                _detailRow(
                  'Prix unitaire',
                  '${_prix(produit).toStringAsFixed(0)} FCFA',
                ),
                const Divider(),
                _detailRow('Stock disponible', '${produit['quantite'] ?? 0}'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  double _prix(Map<String, dynamic> produit) {
    final p = produit['prix'];
    if (p is num) return p.toDouble();
    return double.tryParse(p.toString()) ?? 0;
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(value, style: TextStyle(color: Colors.grey.shade700)),
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

  void _ajouterAuPanier(BuildContext context) {
    final auth = context.read<AuthProvider>();
    if (auth.role != 'client' || auth.clientId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Seuls les clients peuvent ajouter au panier')),
      );
      return;
    }

    context.read<CartProvider>().ajouter(widget.produit, quantite: _quantite);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$_quantite x ${widget.produit['nom']} ajouté au panier'),
        backgroundColor: Colors.green.shade700,
        action: SnackBarAction(
          label: 'Voir',
          textColor: Colors.white,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const PanierScreen()),
            );
          },
        ),
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
              contactNom: widget.produit['producteur']?['nom'] ?? 'Producteur',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['message'] ?? 'Erreur')),
        );
      }
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erreur de connexion')),
      );
    }
  }
}