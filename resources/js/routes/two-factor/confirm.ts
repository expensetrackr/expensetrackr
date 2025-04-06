import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedTwoFactorAuthenticationController.php:19
 * @route /user/confirmed-two-factor-authentication
 */
export const confirm = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: confirm.url(options),
    method: 'post',
})

confirm.definition = {
    methods: ['post'],
    url: '\/user\/confirmed-two-factor-authentication',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedTwoFactorAuthenticationController.php:19
 * @route /user/confirmed-two-factor-authentication
 */
confirm.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return confirm.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedTwoFactorAuthenticationController.php:19
 * @route /user/confirmed-two-factor-authentication
 */
confirm.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: confirm.url(options),
    method: 'post',
})

export default confirm