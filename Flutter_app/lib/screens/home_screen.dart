import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'produits_screen.dart';
import 'commandes_screen.dart';
import 'meteo_screen.dart';
import 'conseils_screen.dart';
import 'annonces_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';
import 'notifications_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final _pages = const [
    ProduitsScreen(),
    CommandesScreen(),
    AnnoncesScreen(),
    MeteoScreen(),
    ConseilsScreen(),
    MessagesScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('KOB-YALGRÉ'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const NotificationsScreen()),
            ),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.account_circle),
            onSelected: (v) {
              if (v == 'profile') {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ProfileScreen()),
                );
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
      body: _pages[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
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
