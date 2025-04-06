import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::redirect
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:45
 * @route /oauth/{provider}
 */
export const redirect = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: redirect.url(args, options),
    method: 'get',
})

redirect.definition = {
    methods: ['get','head'],
    url: '\/oauth\/{provider}',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::redirect
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:45
 * @route /oauth/{provider}
 */
redirect.url = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    const parsedArgs = {
        provider: args.provider,
    }

    return redirect.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::redirect
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:45
 * @route /oauth/{provider}
 */
redirect.get = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: redirect.url(args, options),
    method: 'get',
})

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::redirect
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:45
 * @route /oauth/{provider}
 */
redirect.head = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: redirect.url(args, options),
    method: 'head',
})

export default redirect