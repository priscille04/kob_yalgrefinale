import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';

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
            },
          );
        },
      ),
    );
  }
}
