import { queryParams, type QueryParams } from './../../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::prompt
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:75
 * @route /oauth/{provider}/callback/prompt
 */
export const prompt = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: prompt.url(args, options),
    method: 'get',
})

prompt.definition = {
    methods: ['get','head'],
    url: '\/oauth\/{provider}\/callback\/prompt',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::prompt
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:75
 * @route /oauth/{provider}/callback/prompt
 */
prompt.url = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return prompt.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::prompt
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:75
 * @route /oauth/{provider}/callback/prompt
 */
prompt.get = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: prompt.url(args, options),
    method: 'get',
})

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::prompt
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:75
 * @route /oauth/{provider}/callback/prompt
 */
prompt.head = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: prompt.url(args, options),
    method: 'head',
})

export default prompt