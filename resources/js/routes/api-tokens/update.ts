import { queryParams, type QueryParams } from './../../wayfinder'

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

export default update