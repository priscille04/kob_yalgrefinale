import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class ProducteurDashboard extends StatefulWidget {
  final Map<String, dynamic>? producteur;

  const ProducteurDashboard({super.key, this.producteur});

  @override
  State<ProducteurDashboard> createState() => _ProducteurDashboardState();
}

class _ProducteurDashboardState extends State<ProducteurDashboard> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
  }

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
              radius: 18,
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
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    email,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.normal,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _showLogoutDialog(context),
            tooltip: 'Déconnexion',
          ),
        ],
      ),
      body: const Center(
        child: Text('Tableau de bord Producteur'),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
          switch (index) {
            case 0:
              Navigator.pushNamed(context, '/produits');
              break;
            case 1:
              Navigator.pushNamed(context, '/commandes');
              break;
            case 2:
              Navigator.pushNamed(context, '/messages');
              break;
            case 3:
              Navigator.pushNamed(context, '/meteo');
              break;
            case 4:
              Navigator.pushNamed(context, '/conseils');
              break;
            case 5:
              Navigator.pushNamed(context, '/videos');
              break;
            case 6:
              Navigator.pushNamed(context, '/ussd');
              break;
          }
        },
        type: BottomNavigationBarType.shifting,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.shopping_bag),
            label: 'Produits',
            backgroundColor: Colors.green.shade600,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.shopping_cart),
            label: 'Commandes',
            backgroundColor: Colors.green.shade600,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.message),
            label: 'Messages',
            backgroundColor: Colors.green.shade600,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.wb_sunny),
            label: 'Météo',
            backgroundColor: Colors.green.shade600,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.school),
            label: 'Conseils',
            backgroundColor: Colors.green.shade600,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.video_library),
            label: 'Vidéos',
            backgroundColor: Colors.green.shade600,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.phone),
            label: 'USSD',
            backgroundColor: Colors.green.shade600,
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Déconnexion'),
        content: const Text('Voulez-vous vraiment vous déconnecter ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthProvider>().logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
            child: const Text('Déconnexion'),
          ),
        ],
      ),
    );
  }
}
