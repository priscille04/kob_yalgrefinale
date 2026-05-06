<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    
public function run()
{
    
    $exists = DB::table('utilisateurs')
        ->where('email', 'admin@kobyalgre.bf')
        ->exists();

    if ($exists) {
        return; 
    }

    DB::table('utilisateurs')->insert([
        'nom' => 'Administrateur',
        'email' => 'admin@kobyalgre.bf',
        'mot_de_passe' => Hash::make('admin1234'),
        'role' => 'admin',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

    }
