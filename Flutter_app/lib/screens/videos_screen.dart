import 'package:flutter/material.dart';

class VideosScreen extends StatefulWidget {
  const VideosScreen({super.key});

  @override
  State<VideosScreen> createState() => _VideosScreenState();
}

class _VideosScreenState extends State<VideosScreen> {
  final List<Map<String, dynamic>> videos = [
    {
      'titre': 'Comment cultiver les tomates',
      'description': 'Apprenez les meilleures pratiques de culture de tomates',
      'duree': '12:30',
      'vues': 1200,
    },
    {
      'titre': 'Gestion des parasites agricoles',
      'description': 'Techniques naturelles pour combattre les parasites',
      'duree': '15:45',
      'vues': 890,
    },
    {
      'titre': 'Irrigation efficace',
      'description': 'Optimisez votre consommation d\'eau',
      'duree': '10:20',
      'vues': 654,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: videos.length,
        itemBuilder: (context, index) {
          final video = videos[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Column(
              children: [
                Container(
                  height: 200,
                  width: double.infinity,
                  color: Colors.grey.shade300,
                  child: Center(
                    child: Icon(
                      Icons.play_circle,
                      size: 60,
                      color: Colors.green.shade600,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        video['titre'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        video['description'],
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey.shade700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.timer, size: 16, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(video['duree']),
                            ],
                          ),
                          Row(
                            children: [
                              Icon(Icons.timer, size: 16, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text('${video['vues']}'),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
