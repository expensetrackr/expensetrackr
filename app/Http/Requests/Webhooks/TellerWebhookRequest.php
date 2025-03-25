<?php

declare(strict_types=1);

namespace App\Http\Requests\Webhooks;

use Illuminate\Foundation\Http\FormRequest;

final class TellerWebhookRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'id' => ['required', 'string'],
            'payload' => ['required', 'array'],
            'payload.enrollment_id' => ['sometimes', 'string'],
            'payload.reason' => ['sometimes', 'string'],
            'timestamp' => ['required', 'string'],
            'type' => ['required', 'string', 'in:enrollment.disconnected,transactions.processed,account.number_verification.processed,webhook.test'],
        ];
    }
}
