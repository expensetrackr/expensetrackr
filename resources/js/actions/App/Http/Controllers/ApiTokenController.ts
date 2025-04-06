import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
export const index = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ['get','head'],
    url: '\/user\/api-tokens',
}

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\ApiTokenController::store
 * @see app/Http/Controllers/ApiTokenController.php:29
 * @route /user/api-tokens
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
    url: '\/user\/api-tokens',
}

/**
 * @see \App\Http\Controllers\ApiTokenController::store
 * @see app/Http/Controllers/ApiTokenController.php:29
 * @route /user/api-tokens
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ApiTokenController::store
 * @see app/Http/Controllers/ApiTokenController.php:29
 * @route /user/api-tokens
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

/**
 * @see \App\Http\Controllers\ApiTokenController::update
 * @see app/Http/Controllers/ApiTokenController.php:55
 * @route /user/api-tokens/{token}
 */
export const update = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/user\/api-tokens\/{token}',
}

/**
 * @see \App\Http\Controllers\ApiTokenController::update
 * @see app/Http/Controllers/ApiTokenController.php:55
 * @route /user/api-tokens/{token}
 */
update.url = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return update.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ApiTokenController::update
 * @see app/Http/Controllers/ApiTokenController.php:55
 * @route /user/api-tokens/{token}
 */
update.put = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

/**
 * @see \App\Http\Controllers\ApiTokenController::destroy
 * @see app/Http/Controllers/ApiTokenController.php:75
 * @route /user/api-tokens/{token}
 */
export const destroy = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/user\/api-tokens\/{token}',
}

/**
 * @see \App\Http\Controllers\ApiTokenController::destroy
 * @see app/Http/Controllers/ApiTokenController.php:75
 * @route /user/api-tokens/{token}
 */
destroy.url = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return destroy.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ApiTokenController::destroy
 * @see app/Http/Controllers/ApiTokenController.php:75
 * @route /user/api-tokens/{token}
 */
destroy.delete = (args: { token: string | number } | [token: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ApiTokenController = { index, store, update, destroy }

export default ApiTokenController