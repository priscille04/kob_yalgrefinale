<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use InvalidArgumentException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Prepare a JSON response for the given exception.
     */
    protected function prepareJsonResponse($request, Throwable $e)
    {
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

    /**
     * Sanitize invalid UTF-8 sequences.
     */
    protected function sanitizeUtf8(string $message): string
    {
        $sanitized = @iconv('UTF-8', 'UTF-8//IGNORE', $message);

        if ($sanitized === false || $sanitized === '') {
            $sanitized = @iconv('CP1252', 'UTF-8//IGNORE', $message) ?: $message;
        }

        return $sanitized;
    }
}
