import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
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
    url: '\/user\/confirm-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
show.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return show.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
show.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::show
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:40
 * @route /user/confirm-password
 */
show.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(options),
    method: 'head',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:51
 * @route /user/confirm-password
 */
export const store = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '\/user\/confirm-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:51
 * @route /user/confirm-password
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\ConfirmablePasswordController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/ConfirmablePasswordController.php:51
 * @route /user/confirm-password
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

const ConfirmablePasswordController = { show, store }

export default ConfirmablePasswordController