import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route /email/verification-notification
 */
export const send = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ['post'],
    url: '\/email\/verification-notification',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route /email/verification-notification
 */
send.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return send.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::send
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route /email/verification-notification
 */
send.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: send.url(options),
    method: 'post',
})

export default send