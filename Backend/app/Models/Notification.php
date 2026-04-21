<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'utilisateur_id',
        'titre',
        'message',
        'lu'
    ];

    protected $casts = [
        'lu' => 'boolean'
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
