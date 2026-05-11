<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Model
{
    use HasApiTokens;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'mot_de_passe',
        'role'
    ];

    protected $hidden = [
        'mot_de_passe'
    ];

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function producteur()
    {
        return $this->hasOne(Producteur::class);
    }
}