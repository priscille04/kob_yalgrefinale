<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin par défaut
        $admin = Utilisateur::updateOrCreate(
            ['email' => 'admin@kobyalgre.bf'],
            [
                'nom' => 'Administrateur',
                'telephone' => '+22670000000',
                'mot_de_passe' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Producteur test
        $prod = Utilisateur::updateOrCreate(
            ['email' => 'producteur@test.bf'],
            [
                'nom' => 'Ouédraogo Ibrahim',
                'telephone' => '+22671000000',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'producteur',
            ]
        );
        if (!$prod->producteur) {
            $prod->producteur()->create([
                'type_culture' => 'Maraîchage',
                'localisation' => 'Ouagadougou',
            ]);
        }

        // Client test
        $cli = Utilisateur::updateOrCreate(
            ['email' => 'client@test.bf'],
            [
                'nom' => 'Sawadogo Fatimata',
                'telephone' => '+22672000000',
                'mot_de_passe' => Hash::make('password'),
                'role' => 'client',
            ]
        );
        if (!$cli->client) {
            $cli->client()->create([
                'adresse' => 'Ouaga 2000',
            ]);
        }
    }
}
