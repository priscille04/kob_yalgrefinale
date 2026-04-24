import 'package:flutter/material.dart';

class USSDScreen extends StatefulWidget {
  const USSDScreen({super.key});

  @override
  State<USSDScreen> createState() => _USSDScreenState();
}

class _USSDScreenState extends State<USSDScreen> {
  final List<Map<String, dynamic>> ussdServices = [
    {
      'nom': 'Vérifier le solde',
      'code': '*123#',
      'description': 'Consultez votre solde actuel',
      'icon': Icons.account_balance_wallet,
    },
    {
      'nom': 'Tarification',
      'code': '*456#',
      'description': 'Voir les tarifs et offres disponibles',
      'icon': Icons.price_check,
    },
    {
      'nom': 'Recharger',
      'code': '*789#',
      'description': 'Recharger votre compte',
      'icon': Icons.add_circle,
    },
    {
      'nom': 'Support client',
      'code': '*100#',
      'description': 'Contacter le support',
      'icon': Icons.help,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.green.shade50,
            child: Column(
              children: [
                Icon(
                  Icons.phone,
                  size: 40,
                  color: Colors.green.shade600,
                ),
                const SizedBox(height: 8),
                Text(
                  'Services USSD',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.green.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Accédez rapidement aux services par code USSD',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: ussdServices.length,
              itemBuilder: (context, index) {
                final service = ussdServices[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: Icon(
                      service['icon'],
                      color: Colors.green.shade600,
                      size: 28,
                    ),
                    title: Text(
                      service['nom'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(service['description']),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.green.shade50,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.green.shade300),
                      ),
                      child: Text(
                        service['code'],
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.green.shade600,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    onTap: () => _activateUSSD(service['code']),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _activateUSSD(String code) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Activation du code USSD'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 60,
            ),
            const SizedBox(height: 16),
            Text(
              'Code USSD: $code',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Le code USSD a été copié. Composez-le sur votre téléphone pour activer le service.',
              textAlign: TextAlign.center,
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green.shade600,
            ),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }
}
