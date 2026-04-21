import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  //static const String baseUrl = "http://192.168.11.151:8000/api/v1";
static const String baseUrl = "http://192.168.186.1:8000/api/v1";
  //  récupérer token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // GET PRODUITS
  static Future<List<dynamic>> getProduits() async {
    final token = await getToken();

    final response = await http.get(
      Uri.parse("$baseUrl/produits"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data; // API retourne une liste
    } else {
      return [];
    }
  }

  //  ADD PRODUIT
  static Future<bool> addProduit({
    required String nom,
    required int quantite,
    required double prix,
    required int producteurId,
  }) async {
    final token = await getToken();

    final response = await http.post(
      Uri.parse("$baseUrl/produits"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "nom": nom,
        "quantite": quantite,
        "prix": prix,
        "producteur_id": producteurId,
      }),
    );

    return response.statusCode == 201 || response.statusCode == 200;
  }
}