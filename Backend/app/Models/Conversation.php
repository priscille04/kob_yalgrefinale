<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'client_id',
        'producteur_id',
        'produit_id',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    public function dernierMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }
}
