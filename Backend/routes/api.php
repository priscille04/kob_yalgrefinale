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

// Routes d'authentification (publiques)

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// TEMPORAIRE : SANS SANCTUM (pour corriger erreur 500)
Route::prefix('v1')->group(function () {
    //Route::middleware('auth:sanctum')->group(function () {

    // Produits
    Route::apiResource('produits', ProduitController::class);

    // Utilisateurs
    Route::apiResource('utilisateurs', UtilisateurController::class);

    // Clients
    Route::apiResource('clients', ClientController::class);

    // Producteurs
    Route::apiResource('producteurs', ProducteurController::class);

    // Commandes
    Route::apiResource('commandes', CommandeController::class);

    // Annonces
    Route::apiResource('annonces', AnnonceController::class);

    // Localisations
    Route::apiResource('localisations', LocalisationController::class);

    // Notifications
    Route::apiResource('notifications', NotificationController::class);

    // Types de produits
    Route::apiResource('typeproduits', TypeProduitController::class);

    // Conseils agricoles
    Route::apiResource('conseils-agricoles', ConseilAgricoleController::class);

    // Services météo
    Route::apiResource('services-meteo', ServiceMetheoController::class);

});
##});