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
    if (userData != null) {
      _user = jsonDecode(userData);
    }
    _loading = false;
    notifyListeners();
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
      return 'Impossible de se connecter au serveur';
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
      return 'Impossible de se connecter au serveur';
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
