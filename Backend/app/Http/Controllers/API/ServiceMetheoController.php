<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ServiceMetheo;
use Illuminate\Http\Request;

class ServiceMetheoController extends Controller
{
    public function index()
    {
        return response()->json(ServiceMetheo::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'ville' => 'required|string|max:255',
            'temperature' => 'nullable|string|max:255',
            'pluie_probable' => 'nullable|string|max:255',
            'vent' => 'nullable|string|max:255',
            'humidite' => 'nullable|string|max:255'
        ]);

        $service = ServiceMetheo::create($request->all());
        return response()->json($service, 201);
    }

    public function show(ServiceMetheo $serviceMetheo)
    {
        return response()->json($serviceMetheo);
    }

    public function update(Request $request, ServiceMetheo $serviceMetheo)
    {
        $request->validate([
            'ville' => 'sometimes|required|string|max:255',
            'temperature' => 'nullable|string|max:255',
            'pluie_probable' => 'nullable|string|max:255',
            'vent' => 'nullable|string|max:255',
            'humidite' => 'nullable|string|max:255'
        ]);

        $serviceMetheo->update($request->all());
        return response()->json($serviceMetheo);
    }

    public function destroy(ServiceMetheo $serviceMetheo)
    {
        $serviceMetheo->delete();
        return response()->json(null, 204);
    }
}