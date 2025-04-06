import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::enable
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticationController.php:21
 * @route /user/two-factor-authentication
 */
export const enable = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: enable.url(options),
    method: 'post',
})

enable.definition = {
    methods: ['post'],
    url: '\/user\/two-factor-authentication',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::enable
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticationController.php:21
 * @route /user/two-factor-authentication
 */
enable.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return enable.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController::enable
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorAuthenticationController.php:21
 * @route /user/two-factor-authentication
 */
enable.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: enable.url(options),
    method: 'post',
})

export default enable