import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::disable
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticationController.php:35
 * @route /user/two-factor-authentication
 */
export const disable = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: disable.url(options),
    method: 'delete',
})

disable.definition = {
    methods: ['delete'],
    url: '\/user\/two-factor-authentication',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::disable
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticationController.php:35
 * @route /user/two-factor-authentication
 */
disable.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return disable.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::disable
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticationController.php:35
 * @route /user/two-factor-authentication
 */
disable.delete = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: disable.url(options),
    method: 'delete',
})

export default disable