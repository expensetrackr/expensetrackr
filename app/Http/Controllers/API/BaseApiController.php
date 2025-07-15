<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use RuntimeException;
use Throwable;

abstract class BaseApiController extends Controller
{
    use AuthorizesRequests;

    /**
     * Return a JSON success response.
     *
     * @param  mixed  $data
     */
    protected function successResponse($data = null, string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Return a JSON error response.
     */
    protected function errorResponse(string $message, int $status = 400, ?array $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    /**
     * Return a resource response.
     *
     * @param  JsonResource|ResourceCollection  $resource
     */
    protected function resourceResponse($resource): JsonResponse
    {
        return response()->json($resource);
    }

    /**
     * Handle exceptions and return appropriate API responses.
     */
    protected function handleException(Throwable $exception): JsonResponse
    {
        // Log the exception
        report($exception);

        // Return appropriate error response based on exception type
        return match (true) {
            $exception instanceof \Illuminate\Auth\Access\AuthorizationException => $this->errorResponse('You are not authorized to perform this action.', 403),
            $exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException => $this->errorResponse('Resource not found.', 404),
            $exception instanceof \Illuminate\Validation\ValidationException => $this->errorResponse('Validation failed.', 422, $exception->errors()),
            $exception instanceof RuntimeException => $this->errorResponse($exception->getMessage(), 422),
            default => $this->errorResponse('An error occurred while processing your request.', 500),
        };
    }
}
