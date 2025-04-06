import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route /email/verification-notification
 */
export const store = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '\/email\/verification-notification',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route /email/verification-notification
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/EmailVerificationNotificationController.php:19
 * @route /email/verification-notification
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

const EmailVerificationNotificationController = { store }

export default EmailVerificationNotificationController