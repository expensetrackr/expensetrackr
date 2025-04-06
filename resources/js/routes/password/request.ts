import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::request
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
export const request = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: request.url(options),
    method: 'get',
})

request.definition = {
    methods: ['get','head'],
    url: '\/forgot-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::request
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
request.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return request.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::request
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
request.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: request.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::request
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
request.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: request.url(options),
    method: 'head',
})

export default request