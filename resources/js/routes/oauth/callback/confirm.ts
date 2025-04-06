import { queryParams, type QueryParams } from './../../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::confirm
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:80
 * @route /oauth/{provider}/callback/confirm
 */
export const confirm = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ['post'],
    url: '\/oauth\/{provider}\/callback\/confirm',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::confirm
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:80
 * @route /oauth/{provider}/callback/confirm
 */
confirm.url = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return confirm.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\OAuthController::confirm
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/OAuthController.php:80
 * @route /oauth/{provider}/callback/confirm
 */
confirm.post = (args: { provider: string | number } | [provider: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: confirm.url(args, options),
    method: 'post',
})

export default confirm