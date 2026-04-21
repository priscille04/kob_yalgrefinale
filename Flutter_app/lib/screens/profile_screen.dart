import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late TextEditingController _nomCtrl;
  late TextEditingController _emailCtrl;
  late TextEditingController _telephoneCtrl;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    _nomCtrl = TextEditingController(text: auth.nom);
    _emailCtrl = TextEditingController(text: auth.email);
    _telephoneCtrl = TextEditingController(text: auth.telephone);
  }

  @override
  void dispose() {
    _nomCtrl.dispose();
    _emailCtrl.dispose();
    _telephoneCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Profil'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: Colors.green.shade100,
              child: Text(
                auth.nom.isNotEmpty ? auth.nom[0].toUpperCase() : '?',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.green.shade700,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                auth.role.toUpperCase(),
                style: TextStyle(
                  color: Colors.green.shade700,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
            const SizedBox(height: 32),

            TextField(
              controller: _nomCtrl,
              decoration: InputDecoration(
                labelText: 'Nom',
                prefixIcon: const Icon(Icons.person),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailCtrl,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                prefixIcon: const Icon(Icons.email),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _telephoneCtrl,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: 'Téléphone',
                prefixIcon: const Icon(Icons.phone),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _saving ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade600,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _saving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Enregistrer', style: TextStyle(fontSize: 16)),
              ),
            ),

            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 16),

            _infoTile(Icons.badge, 'ID Utilisateur', '${auth.userId}'),
            if (auth.clientId != null)
              _infoTile(Icons.person, 'ID Client', '${auth.clientId}'),
            if (auth.producteurId != null)
              _infoTile(
                Icons.agriculture,
                'ID Producteur',
                '${auth.producteurId}',
              ),
          ],
        ),
      ),
    );
  }

  Widget _infoTile(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon, color: Colors.green.shade600),
      title: Text(label, style: const TextStyle(fontSize: 13)),
      trailing: Text(
        value,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
      ),
    );
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final auth = context.read<AuthProvider>();
    await auth.updateUser({
      'nom': _nomCtrl.text,
      'email': _emailCtrl.text,
      'telephone': _telephoneCtrl.text,
    });
    if (!mounted) return;
    setState(() => _saving = false);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Profil mis à jour'),
        backgroundColor: Colors.green,
      ),
    );
  }
}
