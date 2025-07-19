<?php

declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Knuckles\Scribe\Attributes\Group;

#[Group(name: 'Transactions')]
final class TransactionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        //
    }

    /**
     * Retrieve a transaction
     *
     * Retrieve a transaction by its public ID for the authenticated user in the current workspace.
     *
     * @return JsonResource<Transaction>
     */
    public function show(Transaction $transaction): JsonResource
    {
        return $transaction->load(['account', 'category', 'merchant'])->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction): void
    {
        //
    }
}
