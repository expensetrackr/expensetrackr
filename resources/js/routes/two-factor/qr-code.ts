import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::qrCode
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
export const qrCode = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: qrCode.url(options),
    method: 'get',
})

qrCode.definition = {
    methods: ['get','head'],
    url: '\/user\/two-factor-qr-code',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::qrCode
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
qrCode.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return qrCode.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::qrCode
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
qrCode.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: qrCode.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController::qrCode
 * @see vendor/laravel/fortify/src/Http/Controllers/TwoFactorQrCodeController.php:16
 * @route /user/two-factor-qr-code
 */
qrCode.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: qrCode.url(options),
    method: 'head',
})

export default qrCode