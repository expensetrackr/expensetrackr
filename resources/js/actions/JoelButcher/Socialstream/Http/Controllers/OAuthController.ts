import { queryParams, type QueryParams } from './../../../../../wayfinder'

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

const OAuthController = { prompt, confirm, redirect, callback }

export default OAuthController