import 'package:flutter/foundation.dart';

class CartItem {
  final Map<String, dynamic> produit;
  int quantite;

  CartItem({required this.produit, this.quantite = 1});

  int get id => produit['id'];
  String get nom => produit['nom'] ?? 'Produit';
  double get prix {
    final p = produit['prix'];
    if (p is num) return p.toDouble();
    return double.tryParse(p.toString()) ?? 0;
  }

  double get sousTotal => prix * quantite;
}

class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get totalArticles => _items.fold(0, (sum, item) => sum + item.quantite);

  double get totalMontant =>
      _items.fold(0.0, (sum, item) => sum + item.sousTotal);

  bool contains(int produitId) =>
      _items.any((item) => item.id == produitId);

  void ajouter(Map<String, dynamic> produit, {int quantite = 1}) {
    final index = _items.indexWhere((item) => item.id == produit['id']);

    if (index >= 0) {
      _items[index].quantite += quantite;
    } else {
      _items.add(CartItem(produit: produit, quantite: quantite));
    }
    notifyListeners();
  }

  void changerQuantite(int produitId, int quantite) {
    final index = _items.indexWhere((item) => item.id == produitId);
    if (index < 0) return;

    if (quantite <= 0) {
      _items.removeAt(index);
    } else {
      _items[index].quantite = quantite;
    }
    notifyListeners();
  }

  void retirer(int produitId) {
    _items.removeWhere((item) => item.id == produitId);
    notifyListeners();
  }

  void vider() {
    _items.clear();
    notifyListeners();
  }
}