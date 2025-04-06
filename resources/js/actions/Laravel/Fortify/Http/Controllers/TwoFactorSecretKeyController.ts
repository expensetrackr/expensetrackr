import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
export const show = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ['get','head'],
    url: '\/user\/two-factor-secret-key',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorSecretKeyController.php:16
 * @route /user/two-factor-secret-key
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

const TwoFactorSecretKeyController = { show }

export default TwoFactorSecretKeyController