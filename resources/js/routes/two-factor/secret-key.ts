import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::secretKey
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
export const secretKey = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: secretKey.url(options),
    method: 'get',
})

secretKey.definition = {
    methods: ['get','head'],
    url: '\/user\/two-factor-secret-key',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::secretKey
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
secretKey.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return secretKey.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::secretKey
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
secretKey.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: secretKey.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::secretKey
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
secretKey.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: secretKey.url(options),
    method: 'head',
})

export default secretKey