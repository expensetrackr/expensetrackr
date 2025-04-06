import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
export const create = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ['get','head'],
    url: '\/forgot-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
create.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return create.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
create.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:24
 * @route /forgot-password
 */
create.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: create.url(options),
    method: 'head',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:35
 * @route /forgot-password
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
    url: '\/forgot-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:35
 * @route /forgot-password
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\PasswordResetLinkController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/PasswordResetLinkController.php:35
 * @route /forgot-password
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

const PasswordResetLinkController = { create, store }

export default PasswordResetLinkController