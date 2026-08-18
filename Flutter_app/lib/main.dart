import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/produits_screen.dart';
import 'screens/commandes_screen.dart';
import 'screens/annonces_screen.dart';
import 'screens/meteo_screen.dart';
import 'screens/conseils_screen.dart';
import 'screens/messages_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/videos_screen.dart';
import 'screens/ussd_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'KOB-YALGRÉ',
            theme: ThemeData(
              colorSchemeSeed: Colors.green,
              useMaterial3: true,
              appBarTheme: const AppBarTheme(centerTitle: true),
            ),
            home: auth.loading
                ? const Scaffold(
                    body: Center(child: CircularProgressIndicator()),
                  )
                : (auth.isAuthenticated
                    ? const HomeScreen()
                    : const LoginScreen()),
            onGenerateRoute: (settings) {
              final isAuth = auth.isAuthenticated;
              final route = settings.name;

              // Routes publiques
              if (route == '/login' || route == '/register') {
                return MaterialPageRoute(
                  builder: (_) => route == '/login'
                      ? const LoginScreen()
                      : const RegisterScreen(),
                  settings: settings,
                );
              }

              // Routes protégées
              if (!isAuth) {
                return MaterialPageRoute(
                  builder: (_) => const LoginScreen(),
                  settings: settings,
                );
              }

              final routes = <String, WidgetBuilder>{
                '/home': (_) => const HomeScreen(),
                '/produits': (_) => const ProduitsScreen(),
                '/commandes': (_) => const CommandesScreen(),
                '/annonces': (_) => const AnnoncesScreen(),
                '/meteo': (_) => const MeteoScreen(),
                '/conseils': (_) => const ConseilsScreen(),
                '/messages': (_) => const MessagesScreen(),
                '/profile': (_) => const ProfileScreen(),
                '/notifications': (_) => const NotificationsScreen(),
                '/videos': (_) => const VideosScreen(),
                '/ussd': (_) => const USSDScreen(),
              };

              final builder = routes[route];
              if (builder != null) {
                return MaterialPageRoute(
                  builder: builder,
                  settings: settings,
                );
              }

              // Route inconnue
              return MaterialPageRoute(
                builder: (_) => const HomeScreen(),
                settings: settings,
              );
            },
          );
        },
      ),
    );
  }
}