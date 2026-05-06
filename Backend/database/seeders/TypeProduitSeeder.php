<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeProduitSeeder extends Seeder
{
    public function run()
    {
        DB::table('typeproduits')->insert([
            ['nom' => 'Maïs'],
            ['nom' => 'Riz'],
            ['nom' => 'Sorgho'],
            ['nom' => 'Mil'],
            ['nom' => 'Coton'],
            ['nom' => 'Arachide'],
            ['nom' => 'Soja'],
            ['nom' => 'Niébé'],
            ['nom' => 'Tomate'],
            ['nom' => 'Oignon'],
            ['nom' => 'Pomme de terre'],
            ['nom' => 'Mangue'],
            ['nom' => 'Banane'],
            ['nom' => 'Papaye'],
             ['nom' => 'piment'],
            ['nom' => 'Igname'],
        ]);
    }
}
