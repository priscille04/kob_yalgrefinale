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
use App\Http\Controllers\API\ConseilAgricoleController;
use App\Http\Controllers\API\ServiceMetheoController;
use App\Http\Controllers\API\ConversationController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\MeteoController;
use App\Http\Controllers\API\BoutiqueController;
use App\Http\Controllers\API\TypeProduitController; 
use App\Http\Controllers\Api\SubscriptionController;

Route::prefix('v1')->group(function () {
    Route::apiResource('boutiques', BoutiqueController::class);

    // Admin helper: generate and email a new admin password
    Route::post('/admin/reset-password', [\App\Http\Controllers\API\AdminController::class, 'resetAdminPassword']);

    // Admin login OTP flow
    Route::post('/admin/login/start-otp', [\App\Http\Controllers\API\AdminController::class, 'startOtpForAdmin']);
    Route::post('/admin/login/verify-otp', [\App\Http\Controllers\API\AdminController::class, 'verifyOtpForAdmin']);
});


// Auth publiques 
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
    Route::post('/resolve-role', [AuthController::class, 'resolveRole']);
});

Route::post('/auth/check-boutique', [AuthController::class, 'checkBoutique']);

//Auth protégées 
Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
});

// Routes publiques 
Route::prefix('v1')->group(function () {

    //  TYPES PRODUITS (AJOUT IMPORTANT)
    Route::get('typeproduits', [TypeProduitController::class, 'index']);
    Route::get('typeproduits/{typeproduit}', [TypeProduitController::class, 'show']);

    Route::get('produits', [ProduitController::class, 'index']);
    Route::get('produits/{produit}', [ProduitController::class, 'show']);

    Route::get('conseils-agricoles', [ConseilAgricoleController::class, 'index']);
    Route::get('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'show']);

    Route::get('annonces', [AnnonceController::class, 'index']);
    Route::get('annonces/{annonce}', [AnnonceController::class, 'show']);

    Route::get('meteo', [MeteoController::class, 'getByVille']);
    Route::get('meteo/coords', [MeteoController::class, 'getByCoords']);
    Route::get('meteo/previsions', [MeteoController::class, 'previsions']);
});

//  Routes authentifiées
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    Route::get('producteur-produits', [ProduitController::class, 'getProducteurProduits']);
    Route::post('produits', [ProduitController::class, 'store']);
    Route::put('produits/{produit}', [ProduitController::class, 'update']);
    Route::patch('produits/{produit}', [ProduitController::class, 'update']);
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy']);

    Route::apiResource('commandes', CommandeController::class);

    Route::post('annonces', [AnnonceController::class, 'store']);
    Route::put('annonces/{annonce}', [AnnonceController::class, 'update']);
    Route::patch('annonces/{annonce}', [AnnonceController::class, 'update']);
    Route::delete('annonces/{annonce}', [AnnonceController::class, 'destroy']);

    Route::post('conseils-agricoles', [ConseilAgricoleController::class, 'store']);
    Route::put('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'update']);
    Route::patch('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'update']);
    Route::delete('conseils-agricoles/{conseils_agricole}', [ConseilAgricoleController::class, 'destroy']);

    Route::apiResource('conversations', ConversationController::class)->except(['update']);
    Route::get('conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::post('conversations/{conversation}/lire', [MessageController::class, 'markAsRead']);

    Route::apiResource('notifications', NotificationController::class);
    Route::apiResource('localisations', LocalisationController::class);
    Route::apiResource('services-meteo', ServiceMetheoController::class);

    Route::middleware('admin')->group(function () {
        Route::apiResource('utilisateurs', UtilisateurController::class);
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('producteurs', ProducteurController::class);
        Route::post('/auth/register-producteur', [AuthController::class, 'registerProducteur']);
    });

    Route::apiResource('boutiques', BoutiqueController::class);
    Route::get('/producteurs', [ProducteurController::class, 'index']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/produits/mes-produits', [ProduitController::class, 'mesProduits']);
    Route::get('/produits/marche', [ProduitController::class, 'marche']);
});



Route::post('/check-subscription', [SubscriptionController::class, 'check']);

//Route::post('/create-subscription', [SubscriptionController::class, 'create']);

Route::post('/validate-code', [SubscriptionController::class, 'validateCode']);

Route::post('/payment', [SubscriptionController::class, 'payment']);

Route::post('/access-elearning', [SubscriptionController::class, 'accessElearning']);

Route::post('/create-subscription', [SubscriptionController::class, 'createSubscription']);
