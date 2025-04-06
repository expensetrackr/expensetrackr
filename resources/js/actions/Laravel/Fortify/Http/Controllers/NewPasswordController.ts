import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route /reset-password/{token}
 */
export const create = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ['get','head'],
    url: '\/reset-password\/{token}',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route /reset-password/{token}
 */
create.url = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    const parsedArgs = {
        token: args.token,
    }

    return create.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route /reset-password/{token}
 */
create.get = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(args, options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::create
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:44
 * @route /reset-password/{token}
 */
create.head = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: create.url(args, options),
    method: 'head',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:55
 * @route /reset-password
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
    url: '\/reset-password',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:55
 * @route /reset-password
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\NewPasswordController::store
 * @see vendor/laravel/fortify/src/Http/Controllers/NewPasswordController.php:55
 * @route /reset-password
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

const NewPasswordController = { create, store }

export default NewPasswordController