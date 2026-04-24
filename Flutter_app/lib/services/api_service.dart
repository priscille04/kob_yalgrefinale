import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // ==========================================
  // CONFIGURATION IP DU BACKEND
  // Modifier cette valeur selon votre environnement:
  // - Emulator Android : 'http://10.0.2.2:8000/api'
  // - Téléphone physique (même WiFi) : 'http://192.168.43.152:8000/api'
  // - iOS Simulator : 'http://localhost:8000/api'
  // ==========================================
static const String _apiBaseUrl = 'http://localhost:8000/api';

  static String get _baseUrl { 
    if (kIsWeb) {
      return 'http://localhost:8000/api';
    }
    // Utilise l'IP configurée ci-dessus
    // Pour émulateur Android, remplacez par 'http://10.0.2.2:8000/api'
    return _apiBaseUrl;
  }

  static String get _v1 => '$_baseUrl/v1';

  // Test de connectivité au backend
  static Future<String> testConnection() async {
    try {
      final response = await http
          .get(Uri.parse('$_baseUrl/auth/login'))
          .timeout(const Duration(seconds: 5));
      return 'Connecté (status: ${response.statusCode})';
    } catch (e) {
      if (e is SocketException) {
        return 'Erreur réseau: ${e.message}\nVérifiez que le téléphone et le PC sont sur le même WiFi.';
      }
      if (e is TimeoutException) {
        return 'Timeout: le serveur ne répond pas.\nVérifiez que le serveur est démarré (php artisan serve --host=0.0.0.0)';
      }
      return 'Erreur: ${e.toString()}';
    }
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<Map<String, String>> _headers({bool auth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (auth) {
      final token = await getToken();
      if (token != null) headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // AUTH
  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode({'email': email, 'mot_de_passe': password}),
    );
    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> register({
    required String nom,
    required String email,
    required String telephone,
    required String password,
    required String role,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/register'),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode({
        'nom': nom,
        'email': email,
        'telephone': telephone,
        'mot_de_passe': password,
        'role': role,
      }),
    );
    return _handleResponse(response);
  }

  static Future<void> logout() async {
    try {
      await http.post(
        Uri.parse('$_baseUrl/auth/logout'),
        headers: await _headers(),
      );
    } catch (_) {}
  }

  static Future<Map<String, dynamic>?> getMe() async {
    final response = await http.get(
      Uri.parse('$_baseUrl/auth/me'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    return null;
  }

  static Future<Map<String, dynamic>> updateProfile(
    int userId,
    Map<String, dynamic> data,
  ) async {
    final response = await http.put(
      Uri.parse('$_v1/utilisateurs/$userId'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return _handleResponse(response);
  }

  // PRODUITS
  static Future<List<dynamic>> getProduits({
    String? search,
    int? typeproduitId,
  }) async {
    final params = <String, String>{};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (typeproduitId != null) {
      params['typeproduit_id'] = typeproduitId.toString();
    }
    params['all'] = '1';
    final uri = Uri.parse(
      '$_v1/produits',
    ).replace(queryParameters: params.isNotEmpty ? params : null);
    final response = await http.get(uri, headers: await _headers());
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  static Future<Map<String, dynamic>?> getProduit(int id) async {
    final response = await http.get(
      Uri.parse('$_v1/produits/$id'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) return jsonDecode(response.body);
    return null;
  }

  // COMMANDES
  static Future<Map<String, dynamic>> createCommande({
    required int clientId,
    required int produitId,
    required int quantite,
  }) async {
    final response = await http.post(
      Uri.parse('$_v1/commandes'),
      headers: await _headers(),
      body: jsonEncode({
        'client_id': clientId,
        'produit_id': produitId,
        'quantite': quantite,
      }),
    );
    return _handleResponse(response);
  }

  static Future<List<dynamic>> getCommandes({
    int? clientId,
    String? statut,
  }) async {
    final params = <String, String>{};
    if (clientId != null) params['client_id'] = clientId.toString();
    if (statut != null) params['statut'] = statut;
    params['all'] = '1';
    final uri = Uri.parse(
      '$_v1/commandes',
    ).replace(queryParameters: params.isNotEmpty ? params : null);
    final response = await http.get(uri, headers: await _headers());
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  static Future<Map<String, dynamic>> updateCommandeStatut(
    int id,
    String statut,
  ) async {
    final response = await http.put(
      Uri.parse('$_v1/commandes/$id'),
      headers: await _headers(),
      body: jsonEncode({'statut': statut}),
    );
    return _handleResponse(response);
  }

  // METEO
  static Future<Map<String, dynamic>?> getMeteo(String ville) async {
    final uri = Uri.parse(
      '$_v1/meteo',
    ).replace(queryParameters: {'ville': ville});
    final response = await http.get(uri, headers: await _headers());
    if (response.statusCode == 200) return jsonDecode(response.body);
    return null;
  }

  static Future<Map<String, dynamic>?> getMeteoByCoords(
      double latitude, double longitude) async {
    final uri = Uri.parse(
      '$_v1/meteo/coords',
    ).replace(queryParameters: {
      'lat': latitude.toString(),
      'lon': longitude.toString(),
    });
    final response = await http.get(uri, headers: await _headers());
    if (response.statusCode == 200) return jsonDecode(response.body);
    return null;
  }

  static Future<Map<String, dynamic>?> getPrevisions(String ville) async {
    final uri = Uri.parse(
      '$_v1/meteo/previsions',
    ).replace(queryParameters: {'ville': ville});
    final response = await http.get(uri, headers: await _headers());
    if (response.statusCode == 200) return jsonDecode(response.body);
    return null;
  }

  // CONSEILS
  static Future<List<dynamic>> getConseils() async {
    final response = await http.get(
      Uri.parse('$_v1/conseils-agricoles?all=1'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  // ANNONCES
  static Future<List<dynamic>> getAnnonces() async {
    final response = await http.get(
      Uri.parse('$_v1/annonces?all=1'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  // NOTIFICATIONS
  static Future<List<dynamic>> getNotifications() async {
    final response = await http.get(
      Uri.parse('$_v1/notifications?all=1'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  static Future<Map<String, dynamic>> markNotificationRead(int id) async {
    final response = await http.put(
      Uri.parse('$_v1/notifications/$id'),
      headers: await _headers(),
      body: jsonEncode({'lu': true}),
    );
    return _handleResponse(response);
  }

  // MESSAGERIE
  static Future<List<dynamic>> getConversations(int utilisateurId) async {
    final uri = Uri.parse(
      '$_v1/conversations',
    ).replace(queryParameters: {'utilisateur_id': utilisateurId.toString()});
    final response = await http.get(uri, headers: await _headers());
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  static Future<Map<String, dynamic>> createConversation({
    required int clientId,
    required int producteurId,
    int? produitId,
  }) async {
    final body = <String, dynamic>{
      'client_id': clientId,
      'producteur_id': producteurId,
    };
    if (produitId != null) body['produit_id'] = produitId;
    final response = await http.post(
      Uri.parse('$_v1/conversations'),
      headers: await _headers(),
      body: jsonEncode(body),
    );
    return _handleResponse(response);
  }

  static Future<List<dynamic>> getMessages(int conversationId) async {
    final response = await http.get(
      Uri.parse('$_v1/conversations/$conversationId/messages'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  static Future<Map<String, dynamic>> sendMessage({
    required int conversationId,
    required int expediteurId,
    required String contenu,
  }) async {
    final response = await http.post(
      Uri.parse('$_v1/conversations/$conversationId/messages'),
      headers: await _headers(),
      body: jsonEncode({'expediteur_id': expediteurId, 'contenu': contenu}),
    );
    return _handleResponse(response);
  }

  static Future<void> markAsRead(int conversationId, int utilisateurId) async {
    await http.post(
      Uri.parse('$_v1/conversations/$conversationId/lire'),
      headers: await _headers(),
      body: jsonEncode({'utilisateur_id': utilisateurId}),
    );
  }

  // TYPE PRODUITS
  static Future<List<dynamic>> getTypeProduits() async {
    final response = await http.get(
      Uri.parse('$_v1/typeproduits'),
      headers: await _headers(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    return [];
  }

  // PRODUITS - AJOUT
  static Future<Map<String, dynamic>> addProduit({
    required String nom,
    required double prix,
    required int quantite,
    required int producteurId,
    File? image,
  }) async {
    final uri = Uri.parse('$_v1/produits');

    // Préparer la requête multipart
    var request = http.MultipartRequest('POST', uri);

    // Ajouter les champs
    request.fields['producteur_id'] = producteurId.toString();
    request.fields['nom'] = nom;
    request.fields['prix'] = prix.toString();
    request.fields['quantite'] = quantite.toString();

    // Ajouter l'image si présente
    if (image != null) {
      request.files
          .add(await http.MultipartFile.fromPath('image', image.path));
    }

    // Ajouter les headers avec token
    final headers = await _headers();
    request.headers.addAll(headers);

    // Envoyer la requête
    final response = await request.send();
    final respStr = await response.stream.bytesToString();

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(respStr) as Map<String, dynamic>;
    } else {
      throw Exception("Erreur lors de l'ajout du produit : $respStr");
    }
  }

  // IMAGE URL
  static String imageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    final base = kIsWeb
        ? 'http://localhost:8000'
        : 'http://192.168.43.152:8000';
    return '$base/storage/$path';
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    body['_statusCode'] = response.statusCode;
    body['_success'] = response.statusCode >= 200 && response.statusCode < 300;
    return body;
  }
}

