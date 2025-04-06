import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\WebhookTellerController::WebhookTellerController
 * @see app/Http/Controllers/WebhookTellerController.php:19
 * @route /api/teller/webhook
 */
const WebhookTellerController = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: WebhookTellerController.url(options),
    method: 'post',
})

WebhookTellerController.definition = {
    methods: ['post'],
    url: '\/api\/teller\/webhook',
}

/**
 * @see \App\Http\Controllers\WebhookTellerController::WebhookTellerController
 * @see app/Http/Controllers/WebhookTellerController.php:19
 * @route /api/teller/webhook
 */
WebhookTellerController.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return WebhookTellerController.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WebhookTellerController::WebhookTellerController
 * @see app/Http/Controllers/WebhookTellerController.php:19
 * @route /api/teller/webhook
 */
WebhookTellerController.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: WebhookTellerController.url(options),
    method: 'post',
})

export default WebhookTellerController