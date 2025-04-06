import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
export const confirm = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: confirm.url(options),
    method: 'get',
})

confirm.definition = {
    methods: ['get','head'],
    url: '\/user\/confirm-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
confirm.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return confirm.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
confirm.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: confirm.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::confirm
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
confirm.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: confirm.url(options),
    method: 'head',
})

export default confirm