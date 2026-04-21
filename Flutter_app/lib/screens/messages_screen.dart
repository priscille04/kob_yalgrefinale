import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'chat_screen.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key});

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  List<dynamic> _conversations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final auth = context.read<AuthProvider>();
    final data = await ApiService.getConversations(auth.userId);
    if (!mounted) return;
    setState(() {
      _conversations = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());

    if (_conversations.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.message_outlined, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 12),
            const Text(
              'Aucune conversation',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 4),
            Text(
              'Contactez un producteur depuis un produit',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade500),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: _conversations.length,
        itemBuilder: (_, i) {
          final conv = _conversations[i];
          final clientNom = conv['client']?['utilisateur']?['nom'] ?? '';
          final producteurNom =
              conv['producteur']?['utilisateur']?['nom'] ?? '';
          final produitNom = conv['produit']?['nom'] ?? '';
          final dernier = conv['dernier_message'];
          final dernierTexte = dernier?['contenu'] ?? '';

          final auth = context.read<AuthProvider>();
          final contactNom = auth.role == 'client' ? producteurNom : clientNom;

          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 6,
              ),
              leading: CircleAvatar(
                backgroundColor: Colors.green.shade100,
                child: Text(
                  contactNom.isNotEmpty ? contactNom[0].toUpperCase() : '?',
                  style: TextStyle(
                    color: Colors.green.shade700,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              title: Text(
                contactNom,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (produitNom.isNotEmpty)
                    Text(
                      'Re: $produitNom',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.green.shade600,
                      ),
                    ),
                  if (dernierTexte.isNotEmpty)
                    Text(
                      dernierTexte,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Colors.grey.shade600,
                        fontSize: 13,
                      ),
                    ),
                ],
              ),
              trailing: Icon(Icons.chevron_right, color: Colors.grey.shade400),
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ChatScreen(
                      conversationId: conv['id'],
                      contactNom: contactNom,
                    ),
                  ),
                );
                _load();
              },
            ),
          );
        },
      ),
    );
  }
}
