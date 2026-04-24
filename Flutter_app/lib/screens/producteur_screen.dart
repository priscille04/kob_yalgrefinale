import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class ProducteurScreen extends StatefulWidget {
  final Map<String, dynamic>? producteur;

  const ProducteurScreen({super.key, this.producteur});

  @override
  State<ProducteurScreen> createState() => _ProducteurScreenState();
}

class _ProducteurScreenState extends State<ProducteurScreen> {
  int _selectedTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    final data = widget.producteur;

    final nom = data?['utilisateur']?['nom'] ?? 'Producteur';
    final email = data?['utilisateur']?['email'] ?? 'Email non disponible';
    final telephone = data?['telephone'] ?? 'Non spécifié';
    final adresse = data?['adresse'] ?? 'Adresse non disponible';
    final description = data?['description'] ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Producteur'),
        backgroundColor: Colors.green,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _showLogoutDialog,
          ),
        ],
      ),

      body: Column(
        children: [

          /// TABS
          Row(
            children: [
              _tabButton("Information", 0),
              _tabButton("Commande", 1),
            ],
          ),

          /// CONTENU
          Expanded(
            child: _selectedTabIndex == 0
                ? _buildInformationTab(nom, email, telephone, adresse, description)
                : _buildOrderTab(),
          ),

          /// ACTIONS (SANS FOND)
          _bottomActions(telephone),
        ],
      ),
    );
  }

  /// ---------------- TAB BUTTON ----------------
  Widget _tabButton(String title, int index) {
    final isSelected = _selectedTabIndex == index;

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTabIndex = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? Colors.green : Colors.transparent,
                width: 3,
              ),
            ),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.green : Colors.grey,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// ---------------- INFO ----------------
  Widget _buildInformationTab(
      String nom, String email, String tel, String adresse, String desc) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          /// PROFIL
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundColor: Colors.green,
                  child: Icon(Icons.person, size: 40, color: Colors.white),
                ),
                const SizedBox(height: 10),
                Text(
                  nom,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          _infoRow(Icons.email, "Email", email),
          _infoRow(Icons.phone, "Téléphone", tel),
          _infoRow(Icons.location_on, "Adresse", adresse),

          if (desc.isNotEmpty) ...[
            const SizedBox(height: 20),
            const Text(
              "Description",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            Text(desc),
          ],
        ],
      ),
    );
  }

  /// ---------------- COMMANDES ----------------
  Widget _buildOrderTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: 3,
      itemBuilder: (_, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text("Commande #${index + 1}"),
            subtitle: const Text("Tomate - 10kg"),
            trailing: TextButton(
              onPressed: () {},
              child: const Text("Valider"),
            ),
          ),
        );
      },
    );
  }

  /// ---------------- LIGNE INFO ----------------
  Widget _infoRow(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      subtitle: Text(value),
    );
  }

  /// ---------------- ACTIONS SANS FOND ----------------
  Widget _bottomActions(String tel) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _iconAction(Icons.message, "Message", _contactProducteur),
          _iconAction(Icons.phone, "Appeler", () => _appelProducteur(tel)),
        ],
      ),
    );
  }

  /// BOUTON STYLE MODERNE (SANS FOND)
  Widget _iconAction(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: Colors.green.shade50,
            child: Icon(icon, color: Colors.green),
          ),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 12)),
        ],
      ),
    );
  }

  /// ---------------- LOGOUT ----------------
  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Déconnexion"),
        content: const Text("Voulez-vous vous déconnecter ?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Annuler"),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<AuthProvider>().logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
            child: const Text("Oui"),
          ),
        ],
      ),
    );
  }

  void _contactProducteur() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Ouverture du message...")),
    );
  }

  void _appelProducteur(String tel) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Appel $tel")),
    );
  }
}
