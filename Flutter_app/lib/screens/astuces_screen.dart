import 'package:flutter/material.dart';

class AstucesScreen extends StatelessWidget {
  const AstucesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Astuces Agricoles"),
        backgroundColor: Colors.green.shade700,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "🌱 Bien cultiver, c’est aussi savoir préserver la terre et anticiper les imprévus. "
            "Voici quelques astuces pratiques pour améliorer vos récoltes et assurer une production durable.",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 20),

          _buildAstuceCard(
            icon: Icons.grass,
            title: "Préparation du sol",
            content:
                "• Labourer en début de saison pour aérer la terre\n"
                "• Ajouter du compost naturel pour enrichir le sol\n"
                "• Éviter les produits chimiques excessifs pour préserver la fertilité",
          ),

          _buildAstuceCard(
            icon: Icons.water_drop,
            title: "Gestion de l’eau",
            content:
                "• Installer un système d’irrigation goutte-à-goutte\n"
                "• Pratiquer le paillage pour retenir l’humidité\n"
                "• Recycler l’eau de pluie pour l’arrosage",
          ),

          _buildAstuceCard(
            icon: Icons.savings,
            title: "Conservation des récoltes",
            content:
                "• Sécher les céréales au soleil avant stockage\n"
                "• Utiliser des silos hermétiques pour éviter l’humidité\n"
                "• Stocker dans un endroit frais et ventilé",
          ),

          _buildAstuceCard(
            icon: Icons.eco,
            title: "Pratiques durables",
            content:
                "• Alterner les cultures pour éviter l’épuisement du sol\n"
                "• Planter des arbres pour réduire l’érosion\n"
                "• Utiliser des plantes répulsives contre les parasites",
          ),

          _buildAstuceCard(
            icon: Icons.lightbulb,
            title: "Astuce en cas de sécheresse",
            content:
                "• Choisir des variétés résistantes comme le mil ou le sorgho\n"
                "• Pailler abondamment pour garder l’humidité\n"
                "• Planter tôt le matin ou en fin de journée pour limiter l’évaporation",
          ),
        ],
      ),
    );
  }

  Widget _buildAstuceCard({
    required IconData icon,
    required String title,
    required String content,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Colors.green.shade700, size: 32),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 6),
                  Text(content),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
        