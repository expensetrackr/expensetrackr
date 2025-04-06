import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WebhookTellerController::webhook
 * @see app/Http/Controllers/WebhookTellerController.php:19
 * @route /api/teller/webhook
 */
export const webhook = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ['post'],
    url: '\/api\/teller\/webhook',
}

/**
 * @see \App\Http\Controllers\WebhookTellerController::webhook
 * @see app/Http/Controllers/WebhookTellerController.php:19
 * @route /api/teller/webhook
 */
webhook.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return webhook.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WebhookTellerController::webhook
 * @see app/Http/Controllers/WebhookTellerController.php:19
 * @route /api/teller/webhook
 */
webhook.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: webhook.url(options),
    method: 'post',
})

export default webhook