import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Spatie\WebhookClient\Http\Controllers\WebhookController::webhookClientPolar
 * @see vendor/spatie/laravel-webhook-client/src/Http/Controllers/WebhookController.php:11
 * @route /polar/webhook
 */
export const webhookClientPolar = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: webhookClientPolar.url(options),
    method: 'post',
})

webhookClientPolar.definition = {
    methods: ['post'],
    url: '\/polar\/webhook',
}

/**
 * @see \Spatie\WebhookClient\Http\Controllers\WebhookController::webhookClientPolar
 * @see vendor/spatie/laravel-webhook-client/src/Http/Controllers/WebhookController.php:11
 * @route /polar/webhook
 */
webhookClientPolar.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return webhookClientPolar.definition.url + queryParams(options)
}

/**
 * @see \Spatie\WebhookClient\Http\Controllers\WebhookController::webhookClientPolar
 * @see vendor/spatie/laravel-webhook-client/src/Http/Controllers/WebhookController.php:11
 * @route /polar/webhook
 */
webhookClientPolar.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: webhookClientPolar.url(options),
    method: 'post',
})

export default webhookClientPolar