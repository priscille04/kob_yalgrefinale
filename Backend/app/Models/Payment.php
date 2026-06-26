<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'subscription_id',
        'methode',
        'telephone',
        'status',
        'montant',
        'reference'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relation (très important)
    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}