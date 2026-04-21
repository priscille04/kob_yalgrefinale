import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<dynamic> _notifications = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final data = await ApiService.getNotifications();
    if (!mounted) return;
    setState(() {
      _notifications = data;
      _loading = false;
    });
  }

  Future<void> _markRead(int id, int index) async {
    await ApiService.markNotificationRead(id);
    setState(() {
      _notifications[index] = {..._notifications[index], 'lu': true};
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.notifications_none,
                    size: 64,
                    color: Colors.grey.shade400,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Aucune notification',
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _notifications.length,
                itemBuilder: (_, i) {
                  final n = _notifications[i];
                  final lu = n['lu'] == true || n['lu'] == 1;

                  return Card(
                    color: lu ? null : Colors.green.shade50,
                    margin: const EdgeInsets.only(bottom: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: lu
                          ? BorderSide.none
                          : BorderSide(color: Colors.green.shade200, width: 1),
                    ),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: lu
                            ? Colors.grey.shade200
                            : Colors.green.shade100,
                        child: Icon(
                          lu
                              ? Icons.notifications_none
                              : Icons.notifications_active,
                          color: lu
                              ? Colors.grey.shade600
                              : Colors.green.shade700,
                        ),
                      ),
                      title: Text(
                        n['titre'] ?? '',
                        style: TextStyle(
                          fontWeight: lu ? FontWeight.normal : FontWeight.bold,
                        ),
                      ),
                      subtitle: Text(
                        n['message'] ?? '',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      trailing: lu
                          ? null
                          : IconButton(
                              icon: Icon(
                                Icons.check_circle_outline,
                                color: Colors.green.shade600,
                              ),
                              onPressed: () => _markRead(n['id'], i),
                            ),
                      onTap: lu ? null : () => _markRead(n['id'], i),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
