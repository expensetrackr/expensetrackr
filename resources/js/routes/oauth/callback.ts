import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::callback
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:55
 * @route /oauth/{provider}/callback
 */
export const callback = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: callback.url(args, options),
    method: 'get',
})

callback.definition = {
    methods: ['get','post','head'],
    url: '\/oauth\/{provider}\/callback',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::callback
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:55
 * @route /oauth/{provider}/callback
 */
callback.url = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return callback.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::callback
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:55
 * @route /oauth/{provider}/callback
 */
callback.get = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: callback.url(args, options),
    method: 'get',
})

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::callback
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:55
 * @route /oauth/{provider}/callback
 */
callback.post = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: callback.url(args, options),
    method: 'post',
})

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::callback
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:55
 * @route /oauth/{provider}/callback
 */
callback.head = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: callback.url(args, options),
    method: 'head',
})

export default callback