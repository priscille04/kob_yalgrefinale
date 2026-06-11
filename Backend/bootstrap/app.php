<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(append: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
        
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (\Throwable $e, $request) {
            if (! $request->expectsJson()) {
                return;
            }

            $message = $e->getMessage() ?: 'Erreur interne du serveur';

            if (! mb_check_encoding($message, 'UTF-8')) {
                $message = @iconv('CP1252', 'UTF-8//IGNORE', $message) ?: 'Erreur interne du serveur';
            }

            return response()->json([
                'message' => $message,
            ], 500);
        });
    })->create();
