import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class ClientScreen extends StatefulWidget {
  const ClientScreen({super.key});

  @override
  State<ClientScreen> createState() => _ClientScreenState();
}

class _ClientScreenState extends State<ClientScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Client'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await context.read<AuthProvider>().logout();
              if (!mounted) return;
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      body: const Center(child: Text('Bienvenue client')),
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
          NavigationDestination(
              icon: Icon(Icons.lightbulb), label: 'Conseils'),
          NavigationDestination(icon: Icon(Icons.message), label: 'Messages'),
        ],
      ),
    );
  }
}

