<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceMetheo extends Model
{
    protected $table = 'servicemetheos';

    protected $fillable = [
        'ville',
        'temperature',
        'pluie_probable',
        'vent',
        'humidite'
    ];
}