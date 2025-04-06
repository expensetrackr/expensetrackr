import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
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
    url: '\/user\/two-factor-qr-code',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

const TwoFactorQrCodeController = { show }

export default TwoFactorQrCodeController