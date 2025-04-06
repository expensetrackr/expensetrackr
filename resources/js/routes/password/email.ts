import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::email
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:35
 * @route /forgot-password
 */
export const email = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: email.url(options),
    method: 'post',
})

email.definition = {
    methods: ['post'],
    url: '\/forgot-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::email
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:35
 * @route /forgot-password
 */
email.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return email.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::email
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:35
 * @route /forgot-password
 */
email.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: email.url(options),
    method: 'post',
})

export default email