<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UtilisateurController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\ProducteurController;
use App\Http\Controllers\API\ProduitController;
use App\Http\Controllers\API\CommandeController;
use App\Http\Controllers\API\AnnonceController;
use App\Http\Controllers\API\LocalisationController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\TypeProduitController;
use App\Http\Controllers\API\ConseilAgricoleController;
use App\Http\Controllers\API\ServiceMetheoController;
use App\Http\Controllers\API\ConversationController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\MeteoController;

// ─── Auth publiques ───────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// ─── Auth protégées ───────────────────────────────
Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
});

// ─── Routes publiques (lecture seule) ─────────────
Route::prefix('v1')->group(function () {
    Route::get('produits', [ProduitController::class, 'index']);
    Route::get('produits/{produit}', [ProduitController::class, 'show']);

    Route::get('conseils-agricoles', [ConseilAgricoleController::class, 'index']);
    Route::get('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'show']);

    Route::get('annonces', [AnnonceController::class, 'index']);
    Route::get('annonces/{annonce}', [AnnonceController::class, 'show']);

    Route::get('typeproduits', [TypeProduitController::class, 'index']);
    Route::get('typeproduits/{typeproduit}', [TypeProduitController::class, 'show']);

    Route::get('meteo', [MeteoController::class, 'getByVille']);
    Route::get('meteo/coords', [MeteoController::class, 'getByCoords']);
    Route::get('meteo/previsions', [MeteoController::class, 'previsions']);
});

// ─── Routes authentifiées ─────────────────────────
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Produits (écriture — producteurs authentifiés)
    Route::post('produits', [ProduitController::class, 'store']);
    Route::put('produits/{produit}', [ProduitController::class, 'update']);
    Route::patch('produits/{produit}', [ProduitController::class, 'update']);
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy']);

    // Commandes
    Route::apiResource('commandes', CommandeController::class);

    // Annonces (écriture)
    Route::post('annonces', [AnnonceController::class, 'store']);
    Route::put('annonces/{annonce}', [AnnonceController::class, 'update']);
    Route::patch('annonces/{annonce}', [AnnonceController::class, 'update']);
    Route::delete('annonces/{annonce}', [AnnonceController::class, 'destroy']);

    // Conseils (écriture)
    Route::post('conseils-agricoles', [ConseilAgricoleController::class, 'store']);
    Route::put('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'update']);
    Route::patch('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'update']);
    Route::delete('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'destroy']);

    // Conversations + messages
    Route::apiResource('conversations', ConversationController::class)->except(['update']);
    Route::get('conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::post('conversations/{conversation}/lire', [MessageController::class, 'markAsRead']);

    // Notifications
    Route::apiResource('notifications', NotificationController::class);

    // Localisations
    Route::apiResource('localisations', LocalisationController::class);

    // Services météo CRUD
    Route::apiResource('services-meteo', ServiceMetheoController::class);

    // ─── Admin uniquement ─────────────────────────
    Route::middleware('admin')->group(function () {
        Route::apiResource('utilisateurs', UtilisateurController::class);
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('producteurs', ProducteurController::class);

        Route::post('typeproduits', [TypeProduitController::class, 'store']);
        Route::put('typeproduits/{typeproduit}', [TypeProduitController::class, 'update']);
        Route::patch('typeproduits/{typeproduit}', [TypeProduitController::class, 'update']);
        Route::delete('typeproduits/{typeproduit}', [TypeProduitController::class, 'destroy']);
    });
});