import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class CommandesScreen extends StatefulWidget {
  const CommandesScreen({super.key});

  @override
  State<CommandesScreen> createState() => _CommandesScreenState();
}

class _CommandesScreenState extends State<CommandesScreen> {
  List<dynamic> _commandes = [];
  bool _loading = true;
  String? _filterStatut;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final auth = context.read<AuthProvider>();
    final data = await ApiService.getCommandes(
      clientId: auth.role == 'client' ? auth.clientId : null,
      statut: _filterStatut,
    );
    if (!mounted) return;
    setState(() {
      _commandes = data;
      _loading = false;
    });
  }

  Color _statutColor(String statut) {
    switch (statut) {
      case 'en_attente':
        return Colors.orange;
      case 'confirmee':
        return Colors.blue;
      case 'en_cours':
        return Colors.indigo;
      case 'livree':
        return Colors.green;
      case 'annulee':
        return Colors.red;
      case 'refusee':
        return Colors.red.shade800;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              _filterChip(null, 'Toutes'),
              _filterChip('en_attente', 'En attente'),
              _filterChip('confirmee', 'Confirmée'),
              _filterChip('en_cours', 'En cours'),
              _filterChip('livree', 'Livrée'),
              _filterChip('annulee', 'Annulée'),
              _filterChip('refusee', 'Refusée'),
            ],
          ),
        ),
        Expanded(
          child: _loading
              ? const Center(child: CircularProgressIndicator())
              : _commandes.isEmpty
              ? const Center(
                  child: Text(
                    'Aucune commande',
                    style: TextStyle(color: Colors.grey),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: _commandes.length,
                    itemBuilder: (_, i) {
                      final c = _commandes[i];
                      final statut = c['statut'] ?? 'en_attente';
                      final total =
                          (c['total'] is String
                                  ? double.tryParse(c['total'])
                                  : c['total'])
                              ?.toStringAsFixed(0) ??
                          '0';
                      final produitNom =
                          c['produit']?['nom'] ?? 'Produit #${c['produit_id']}';
                      final clientNom =
                          c['client']?['utilisateur']?['nom'] ?? '';

                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '#${c['id']}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: _statutColor(statut).withAlpha(30),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      statut,
                                      style: TextStyle(
                                        color: _statutColor(statut),
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                produitNom,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              if (clientNom.isNotEmpty)
                                Text(
                                  'Client: $clientNom',
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Qté: ${c['quantite']}',
                                    style: TextStyle(
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                  Text(
                                    '$total FCFA',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.green.shade700,
                                      fontSize: 15,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
        ),
      ],
    );
  }

  Widget _filterChip(String? statut, String label) {
    final selected = _filterStatut == statut;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: selected,
        selectedColor: Colors.green.shade100,
        onSelected: (_) {
          setState(() => _filterStatut = statut);
          _load();
        },
      ),
    );
  }
}
