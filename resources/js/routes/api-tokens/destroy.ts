import { queryParams, type QueryParams } from './../../wayfinder'

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

export default destroy