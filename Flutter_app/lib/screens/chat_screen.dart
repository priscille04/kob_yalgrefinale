import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class ChatScreen extends StatefulWidget {
  final int conversationId;
  final String contactNom;
  const ChatScreen({
    super.key,
    required this.conversationId,
    required this.contactNom,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  List<dynamic> _messages = [];
  bool _loading = true;
  final _msgCtrl = TextEditingController();
  final _scrollCtrl = ScrollController();
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await ApiService.getMessages(widget.conversationId);
    if (!mounted) return;
    setState(() {
      _messages = data;
      _loading = false;
    });
    _scrollToBottom();

    final auth = context.read<AuthProvider>();
    ApiService.markAsRead(widget.conversationId, auth.userId);
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _send() async {
    final text = _msgCtrl.text.trim();
    if (text.isEmpty || _sending) return;

    setState(() => _sending = true);
    final auth = context.read<AuthProvider>();

    final result = await ApiService.sendMessage(
      conversationId: widget.conversationId,
      expediteurId: auth.userId,
      contenu: text,
    );

    if (!mounted) return;
    setState(() => _sending = false);

    if (result['_success'] == true) {
      _msgCtrl.clear();
      _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.contactNom),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                ? const Center(
                    child: Text(
                      'Aucun message',
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollCtrl,
                    padding: const EdgeInsets.all(12),
                    itemCount: _messages.length,
                    itemBuilder: (_, i) {
                      final msg = _messages[i];
                      final isMe = msg['expediteur_id'] == auth.userId;

                      return Align(
                        alignment: isMe
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Container(
                          constraints: BoxConstraints(
                            maxWidth: MediaQuery.of(context).size.width * 0.75,
                          ),
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: isMe
                                ? Colors.green.shade500
                                : Colors.grey.shade200,
                            borderRadius: BorderRadius.only(
                              topLeft: const Radius.circular(14),
                              topRight: const Radius.circular(14),
                              bottomLeft: Radius.circular(isMe ? 14 : 4),
                              bottomRight: Radius.circular(isMe ? 4 : 14),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (!isMe)
                                Text(
                                  msg['expediteur']?['nom'] ?? '',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              Text(
                                msg['contenu'] ?? '',
                                style: TextStyle(
                                  color: isMe ? Colors.white : Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),

          Container(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(13),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgCtrl,
                      decoration: InputDecoration(
                        hintText: 'Votre message...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                      ),
                      onSubmitted: (_) => _send(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: Colors.green.shade600,
                    child: IconButton(
                      icon: _sending
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(
                              Icons.send,
                              color: Colors.white,
                              size: 18,
                            ),
                      onPressed: _send,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
