import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route /user/confirmed-password-status
 */
export const confirmation = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: confirmation.url(options),
    method: 'get',
})

confirmation.definition = {
    methods: ['get','head'],
    url: '\/user\/confirmed-password-status',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route /user/confirmed-password-status
 */
confirmation.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return confirmation.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route /user/confirmed-password-status
 */
confirmation.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: confirmation.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController::confirmation
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmedPasswordStatusController.php:17
 * @route /user/confirmed-password-status
 */
confirmation.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: confirmation.url(options),
    method: 'head',
})

export default confirmation