<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class Handler extends ExceptionHandler
{
    
    protected $dontReport = [
        //
    ];

    
     
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    
    
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

   
    protected function prepareJsonResponse($request, Throwable $e)
    {
        // Corriger le cas "Unauthenticated" (Sanctum / auth:sanctum) : éviter de renvoyer un 500.
        if ($e instanceof AuthenticationException) {
            return response()->json([
                'message' => $e->getMessage() ?: 'Unauthenticated.',
            ], 401);
        }

        if ($e instanceof UnauthorizedHttpException) {
            return response()->json([
                'message' => $e->getMessage() ?: 'Unauthorized.',
            ], 401);
        }

        // Certaines exceptions peuvent tomber avec un status sans être reconnues.
        if ($e instanceof HttpExceptionInterface) {
            $status = $e->getStatusCode();
            if ($status === 401 || $status === 403) {
                return response()->json([
                    'message' => $e->getMessage() ?: ($status === 401 ? 'Unauthenticated.' : 'Forbidden'),
                ], $status);
            }
        }

        try {
            return parent::prepareJsonResponse($request, $e);
        } catch (InvalidArgumentException $exception) {
            if (str_contains($exception->getMessage(), 'Malformed UTF-8 characters')) {
                return response()->json([
                    'message' => $this->sanitizeUtf8($e->getMessage() ?: 'Erreur interne du serveur'),
                ], $this->isHttpException($e) ? $e->getStatusCode() : 500);
            }

            throw $exception;
        }
    }

   
    protected function sanitizeUtf8(string $message): string
    {
        $sanitized = @iconv('UTF-8', 'UTF-8//IGNORE', $message);

        if ($sanitized === false || $sanitized === '') {
            $sanitized = @iconv('CP1252', 'UTF-8//IGNORE', $message) ?: $message;
        }

        return $sanitized;
    }
}

