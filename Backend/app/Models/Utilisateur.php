<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Model
{
    use HasApiTokens;

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

    public function localisations()
    {
        return $this->hasMany(Localisation::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
