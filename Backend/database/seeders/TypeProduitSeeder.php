<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeProduitSeeder extends Seeder
{
    public function run()
    {
        // Structure attendue par l’app :
        // produits_json = [ { nom: string, description?: string }, ... ]
        $data = [
            'Céréales' => [
                ['nom' => 'Maïs', 'description' => 'Maïs'],
                ['nom' => 'Mil', 'description' => 'Mil'],
                ['nom' => 'Sorgho', 'description' => 'Sorgho'],
            ],
            'Légumineuses' => [
                ['nom' => 'Haricots', 'description' => 'Haricots'],
            ],
            'Tubercules' => [
                ['nom' => 'Igname', 'description' => 'Igname'],
            ],
            'Légumes' => [
                ['nom' => 'Tomates', 'description' => 'Tomates'],
                ['nom' => 'Oignons', 'description' => 'Oignons'],
                ['nom' => 'Piment', 'description' => 'Piment'],
            ],
            'Fruits' => [
                ['nom' => 'Mangues', 'description' => 'Mangues'],
            ],
            'Cultures industrielles' => [
                ['nom' => 'Coton', 'description' => 'Coton'],
            ],
        ];

        foreach ($data as $type => $produits) {
            DB::table('typeproduits')->updateOrInsert(
                ['nom' => $type],
                [
                    'produits_json' => json_encode($produits, JSON_UNESCAPED_UNICODE),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}

