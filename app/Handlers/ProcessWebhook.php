<?php

declare(strict_types=1);

namespace App\Handlers;

use Illuminate\Support\Facades\Log;
use Spatie\WebhookClient\Jobs\ProcessWebhookJob;

final class ProcessWebhook extends ProcessWebhookJob
{
    public function handle()
    {
        $decoded = json_decode($this->webhookCall, true);
        $data = $decoded['payload'];

        switch ($data['type']) {
            case 'order.created':
                // Handle the order created event
                break;
            case 'order.updated':
                // Handle the order updated event
                break;
            case 'subscription.created':
                // Handle the subscription created event
                break;
            case 'subscription.updated':
                // Handle the subscription updated event
                break;
            case 'subscription.active':
                // Handle the subscription active event
                break;
            case 'subscription.canceled':
                // Handle the subscription canceled event
                break;
            case 'subscription.revoked':
                // Handle the subscription revoked event
                break;
            case 'benefit_grant.created':
                // Handle the benefit grant created event
                break;
            case 'benefit_grant.updated':
                // Handle the benefit grant updated event
                break;
            case 'benefit_grant.revoked':
                // Handle the benefit grant revoked event
                break;
            default:
                // Handle unknown event
                Log::info($data['type']);
                break;
        }

        // Acknowledge you received the response
        http_response_code(200);
    }
}
