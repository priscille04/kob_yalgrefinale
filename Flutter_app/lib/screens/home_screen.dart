import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'producteur_screen.dart';
import 'client_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    // Rediriger selon le rôle vers l'écran dédié
    if (auth.isAuthenticated && auth.role.toLowerCase() == 'producteur') {
      return const ProducteurScreen();
    }

    if (auth.isAuthenticated && auth.role.toLowerCase() == 'client') {
      return const ClientScreen();
    }


    return Scaffold(
      appBar: AppBar(
        title: const Text('KOB-YALGRÉ'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => Navigator.pushNamed(context, '/notifications'),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.account_circle),
            onSelected: (v) {
              if (v == 'profile') {
                Navigator.pushNamed(context, '/profile');
              } else if (v == 'logout') {
                auth.logout();
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
            itemBuilder: (_) => [
              PopupMenuItem(
                enabled: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      auth.nom,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    Text(
                      auth.role,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem(
                value: 'profile',
                child: Row(
                  children: [
                    Icon(Icons.person, size: 18, color: Colors.grey),
                    SizedBox(width: 8),
                    Text('Mon Profil'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, size: 18, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Déconnexion'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: const Center(
        child: Text('Bienvenue sur KOB-YALGRÉ'),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) {
          setState(() => _currentIndex = i);
          switch (i) {
            case 0:
              Navigator.pushNamed(context, '/produits');
              break;
            case 1:
              Navigator.pushNamed(context, '/commandes');
              break;
            case 2:
              Navigator.pushNamed(context, '/annonces');
              break;
            case 3:
              Navigator.pushNamed(context, '/meteo');
              break;
            case 4:
              Navigator.pushNamed(context, '/conseils');
              break;
            case 5:
              Navigator.pushNamed(context, '/messages');
              break;
          }
        },
        indicatorColor: Colors.green.shade100,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.store), label: 'Produits'),
          NavigationDestination(
            icon: Icon(Icons.shopping_cart),
            label: 'Commandes',
          ),
          NavigationDestination(icon: Icon(Icons.campaign), label: 'Annonces'),
          NavigationDestination(icon: Icon(Icons.cloud), label: 'Météo'),
          NavigationDestination(icon: Icon(Icons.lightbulb), label: 'Conseils'),
          NavigationDestination(icon: Icon(Icons.message), label: 'Messages'),
        ],
      ),
    );
  }
}
