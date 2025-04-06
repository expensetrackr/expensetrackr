import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Spatie\WebhookClient\Http\Controllers\WebhookController::WebhookController
 * @see vendor/spatie/laravel-webhook-client/src/Http/Controllers/WebhookController.php:11
 * @route /polar/webhook
 */
const WebhookController = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: WebhookController.url(options),
    method: 'post',
})

WebhookController.definition = {
    methods: ['post'],
    url: '\/polar\/webhook',
}

/**
 * @see \Spatie\WebhookClient\Http\Controllers\WebhookController::WebhookController
 * @see vendor/spatie/laravel-webhook-client/src/Http/Controllers/WebhookController.php:11
 * @route /polar/webhook
 */
WebhookController.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return WebhookController.definition.url + queryParams(options)
}

/**
 * @see \Spatie\WebhookClient\Http\Controllers\WebhookController::WebhookController
 * @see vendor/spatie/laravel-webhook-client/src/Http/Controllers/WebhookController.php:11
 * @route /polar/webhook
 */
WebhookController.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: WebhookController.url(options),
    method: 'post',
})

export default WebhookController