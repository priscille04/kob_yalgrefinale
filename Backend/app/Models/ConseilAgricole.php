<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConseilAgricole extends Model
{
    protected $table = 'conseilagricoles';

    protected $fillable = [
        'titre',
        'contenu'
    ];
}
