<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Exceptions\Account\AccountDeletionException;
use App\Exceptions\Account\AccountNotFoundException;
use App\Exceptions\Account\InsufficientBalanceException;
use App\Exceptions\Account\InvalidAccountTypeException;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Validation\ValidationException;
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
        $response = [
            'success' => true,
            'data' => $resource,
        ];

        // Include pagination metadata if present
        if ($resource instanceof ResourceCollection && method_exists($resource, 'response')) {
            $resourceResponse = $resource->response();
            if ($resourceResponse->getData(true) && isset($resourceResponse->getData(true)['meta'])) {
                $response['meta'] = $resourceResponse->getData(true)['meta'];
            }
        }

        return response()->json($response);
    }

    /**
     * Handle exceptions and return appropriate API responses.
     */
    protected function handleException(Throwable $exception): JsonResponse
    {
        // Log the exception with context
        report($exception);

        // Return appropriate error response based on exception type
        return match (true) {
            $exception instanceof AccountNotFoundException => $this->handleAccountException($exception),
            $exception instanceof InvalidAccountTypeException => $this->handleAccountException($exception),
            $exception instanceof InsufficientBalanceException => $this->handleAccountException($exception),
            $exception instanceof AccountDeletionException => $this->handleAccountException($exception),
            $exception instanceof AuthorizationException => $this->errorResponse('You are not authorized to perform this action.', 403),
            $exception instanceof ModelNotFoundException => $this->errorResponse('Resource not found.', 404),
            $exception instanceof ValidationException => $this->errorResponse('Validation failed.', 422, $exception->errors()),
            $exception instanceof RuntimeException => $this->errorResponse($exception->getMessage(), 422),
            default => $this->errorResponse('An error occurred while processing your request.', 500),
        };
    }

    /**
     * Handle account-specific exceptions.
     */
    protected function handleAccountException(Throwable $exception): JsonResponse
    {
        // Account exceptions have their own render method
        if (method_exists($exception, 'render')) {
            return $exception->render(request());
        }

        // Fallback to generic error handling
        return $this->errorResponse($exception->getMessage(), $exception->getCode() ?: 422);
    }
}
