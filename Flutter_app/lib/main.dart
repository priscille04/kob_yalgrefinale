import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
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
    return ChangeNotifierProvider(
      create: (_) => AuthProvider(),
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
            routes: {
              '/login': (_) => const LoginScreen(),
              '/register': (_) => const RegisterScreen(),
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
            },
          );
        },
      ),
    );
  }
}
