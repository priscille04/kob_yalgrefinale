import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _user;
  bool _loading = true;

  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get loading => _loading;
  int get userId => _user?['id'] ?? 0;
  String get role => _user?['role'] ?? '';
  String get nom => _user?['nom'] ?? '';
  String get email => _user?['email'] ?? '';
  String get telephone => _user?['telephone'] ?? '';
  int? get clientId => _user?['client_id'];
  int? get producteurId => _user?['producteur_id'];

  AuthProvider() {
    _loadUser();
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user');
    final token = prefs.getString('token');

    if (userData != null && token != null) {
      try {
        // Valider le token avec le backend
        final me = await ApiService.getMe();
        if (me != null) {
          _user = me;
          // Mettre à jour le cache local si le backend a des données plus récentes
          await prefs.setString('user', jsonEncode(_user));
        } else {
          // Token invalide — déconnexion silencieuse
          await _clearAuth(prefs);
        }
      } catch (e) {
        debugPrint('TOKEN VALIDATION ERROR: $e');
        // En cas d'erreur réseau au démarrage, on garde la session locale
        // mais on marque l'utilisateur comme chargé
        _user = jsonDecode(userData);
      }
    }

    _loading = false;
    notifyListeners();
  }

  Future<void> _clearAuth(SharedPreferences prefs) async {
    await prefs.remove('token');
    await prefs.remove('user');
    _user = null;
  }

  Future<String?> login(String email, String password) async {
    try {
      final result = await ApiService.login(email, password);
      if (result['_success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', result['token']);
        _user = result['utilisateur'];
        await prefs.setString('user', jsonEncode(_user));
        notifyListeners();
        return null;
      }
      return result['message'] ?? 'Erreur de connexion';
    } catch (e) {
      debugPrint('LOGIN ERROR: $e');
      return 'Erreur réseau: ${e.toString()}';
    }
  }

  Future<String?> register({
    required String nom,
    required String email,
    required String telephone,
    required String password,
    required String role,
  }) async {
    try {
      final result = await ApiService.register(
        nom: nom,
        email: email,
        telephone: telephone,
        password: password,
        role: role,
      );
      if (result['_success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', result['token']);
        _user = result['utilisateur'];
        await prefs.setString('user', jsonEncode(_user));
        notifyListeners();
        return null;
      }
      return result['message'] ?? "Erreur lors de l'inscription";
    } catch (e) {
      debugPrint('REGISTER ERROR: $e');
      return 'Erreur réseau: ${e.toString()}';
    }
  }

  Future<void> updateUser(Map<String, dynamic> data) async {
    if (_user != null) {
      _user = {..._user!, ...data};
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user', jsonEncode(_user));
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      await ApiService.logout();
    } catch (_) {}
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
    _user = null;
    notifyListeners();
  }
}
