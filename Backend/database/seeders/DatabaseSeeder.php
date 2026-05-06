<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use App\Models\TypeProduit;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\Annonce;
use App\Models\ConseilAgricole;
use App\Models\Notification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin
        $admin = Utilisateur::updateOrCreate(
            ['email' => 'admin@kobyalgre.bf'],
            [
                'nom' => 'Administrateur',
                'telephone' => '+22670000000',
                'mot_de_passe' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );
            $this->call([
    AdminSeeder::class,
           ]);
        // Producteur 1
        $prod1 = Utilisateur::updateOrCreate(
            ['email' => 'producteur@test.bf'],
            [
                'nom' => 'Ouédraogo Ibrahim',
                'telephone' => '+22671000000',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'producteur',
            ]
        );
        $producteur1 = $prod1->producteur ?? $prod1->producteur()->create([
            'type_culture' => 'Maraîchage',
            'localisation' => 'Ouagadougou',
        ]);

        // Producteur 2
        $prod2 = Utilisateur::updateOrCreate(
            ['email' => 'koanda@test.bf'],
            [
                'nom' => 'Koanda Moussa',
                'telephone' => '+22673000000',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'producteur',
            ]
        );
        $producteur2 = $prod2->producteur ?? $prod2->producteur()->create([
            'type_culture' => 'Céréales',
            'localisation' => 'Bobo-Dioulasso',
        ]);

        // Client 1
        $cli1 = Utilisateur::updateOrCreate(
            ['email' => 'client@test.bf'],
            [
                'nom' => 'Sawadogo Fatimata',
                'telephone' => '+22672000000',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'client',
            ]
        );
        $client1 = $cli1->client ?? $cli1->client()->create(['adresse' => 'Ouaga 2000']);

        // Client 2
        $cli2 = Utilisateur::updateOrCreate(
            ['email' => 'traore@test.bf'],
            [
                'nom' => 'Traoré Aminata',
                'telephone' => '+22674000000',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'client',
            ]
        );
        $client2 = $cli2->client ?? $cli2->client()->create(['adresse' => 'Koudougou Centre']);

        // Types de produits
        $types = [];
        foreach (['Légumes', 'Fruits', 'Céréales', 'Tubercules', 'Épices'] as $nom) {
            $types[] = TypeProduit::firstOrCreate(['nom' => $nom]);
        }

        // Produits
        $produitsData = [
            ['nom' => 'Tomates fraîches', 'description' => 'Tomates biologiques cultivées en plein champ', 'quantite' => 200, 'prix' => 500, 'producteur_id' => $producteur1->id, 'typeproduit_id' => $types[0]->id],
            ['nom' => 'Oignons violets', 'description' => 'Oignons de qualité supérieure de Ouagadougou', 'quantite' => 150, 'prix' => 350, 'producteur_id' => $producteur1->id, 'typeproduit_id' => $types[0]->id],
            ['nom' => 'Mangues Kent', 'description' => 'Mangues sucrées et juteuses', 'quantite' => 300, 'prix' => 750, 'producteur_id' => $producteur1->id, 'typeproduit_id' => $types[1]->id],
            ['nom' => 'Maïs blanc', 'description' => 'Maïs de saison, séché et nettoyé', 'quantite' => 500, 'prix' => 250, 'producteur_id' => $producteur2->id, 'typeproduit_id' => $types[2]->id],
            ['nom' => 'Mil', 'description' => 'Mil traditionnel du Burkina', 'quantite' => 400, 'prix' => 300, 'producteur_id' => $producteur2->id, 'typeproduit_id' => $types[2]->id],
            ['nom' => 'Igname', 'description' => 'Ignames fraîches de Bobo-Dioulasso', 'quantite' => 100, 'prix' => 1200, 'producteur_id' => $producteur2->id, 'typeproduit_id' => $types[3]->id],
            ['nom' => 'Piment frais', 'description' => 'Piment rouge très piquant', 'quantite' => 80, 'prix' => 600, 'producteur_id' => $producteur1->id, 'typeproduit_id' => $types[4]->id],
            ['nom' => 'Sorgho rouge', 'description' => 'Sorgho pour dolo et tô', 'quantite' => 350, 'prix' => 275, 'producteur_id' => $producteur2->id, 'typeproduit_id' => $types[2]->id],
        ];

        $produits = [];
        foreach ($produitsData as $p) {
            $produits[] = Produit::firstOrCreate(['nom' => $p['nom']], $p);
        }

        // Commandes
        $commandesData = [
            ['client_id' => $client1->id, 'produit_id' => $produits[0]->id, 'quantite' => 10, 'total' => 5000, 'statut' => 'livree'],
            ['client_id' => $client1->id, 'produit_id' => $produits[2]->id, 'quantite' => 5, 'total' => 3750, 'statut' => 'en_cours'],
            ['client_id' => $client2->id, 'produit_id' => $produits[3]->id, 'quantite' => 20, 'total' => 5000, 'statut' => 'confirmee'],
            ['client_id' => $client2->id, 'produit_id' => $produits[5]->id, 'quantite' => 3, 'total' => 3600, 'statut' => 'en_attente'],
            ['client_id' => $client1->id, 'produit_id' => $produits[4]->id, 'quantite' => 15, 'total' => 4500, 'statut' => 'annulee'],
            ['client_id' => $client2->id, 'produit_id' => $produits[6]->id, 'quantite' => 2, 'total' => 1200, 'statut' => 'refusee'],
        ];

        foreach ($commandesData as $c) {
            Commande::firstOrCreate(
                ['client_id' => $c['client_id'], 'produit_id' => $c['produit_id'], 'statut' => $c['statut']],
                $c
            );
        }

        // Annonces
        $annoncesData = [
            ['producteur_id' => $producteur1->id, 'titre' => 'Récolte de tomates disponible', 'contenu' => 'Nouvelle récolte de tomates biologiques disponible. Quantité limitée, commandez vite !'],
            ['producteur_id' => $producteur1->id, 'titre' => 'Promo mangues saison', 'contenu' => 'Les mangues Kent sont à prix réduit pour la fin de saison. Profitez-en !'],
            ['producteur_id' => $producteur2->id, 'titre' => 'Arrivage céréales', 'contenu' => 'Nouveau stock de maïs et mil disponible à Bobo-Dioulasso. Livraison possible sur Ouaga.'],
        ];

        foreach ($annoncesData as $a) {
            Annonce::firstOrCreate(['titre' => $a['titre']], $a);
        }

        // Conseils agricoles
        $conseilsData = [
            ['titre' => 'Irrigation goutte à goutte', 'contenu' => "L'irrigation goutte à goutte permet d'économiser jusqu'à 60% d'eau par rapport à l'irrigation traditionnelle. Idéale pour le maraîchage en saison sèche."],
            ['titre' => 'Rotation des cultures', 'contenu' => 'Alternez vos cultures chaque saison pour préserver la fertilité du sol. Exemple : tomates → haricots → maïs → jachère.'],
            ['titre' => 'Compostage maison', 'contenu' => 'Utilisez les déchets végétaux et le fumier pour créer un compost riche. Laissez fermenter 2-3 mois avant utilisation.'],
            ['titre' => 'Protection contre les nuisibles', 'contenu' => 'Le neem est un insecticide naturel efficace. Préparez une décoction de feuilles de neem et pulvérisez sur vos cultures.'],
        ];

        foreach ($conseilsData as $c) {
            ConseilAgricole::firstOrCreate(['titre' => $c['titre']], $c);
        }

        // Notifications
        Notification::firstOrCreate(
            ['utilisateur_id' => $cli1->id, 'titre' => 'Bienvenue sur KOB-YALGRÉ'],
            ['message' => 'Votre compte client a été créé avec succès. Découvrez nos produits !', 'lu' => true]
        );
        Notification::firstOrCreate(
            ['utilisateur_id' => $prod1->id, 'titre' => 'Nouvelle commande reçue'],
            ['message' => 'Vous avez reçu une commande de 10 kg de tomates. Vérifiez votre espace commandes.', 'lu' => false]
        );
        Notification::firstOrCreate(
            ['utilisateur_id' => $cli2->id, 'titre' => 'Commande confirmée'],
            ['message' => 'Votre commande de maïs a été confirmée par le producteur.', 'lu' => false]
        );
    }
}
