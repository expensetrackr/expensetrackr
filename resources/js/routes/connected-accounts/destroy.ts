import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\ConnectedAccountController::destroy
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/ConnectedAccountController.php:19
 * @route /user/connected-account/{id}
 */
export const destroy = (args: { id: string | number } | [id: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/user\/connected-account\/{id}',
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\ConnectedAccountController::destroy
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/ConnectedAccountController.php:19
 * @route /user/connected-account/{id}
 */
destroy.url = (args: { id: string | number } | [id: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    const parsedArgs = {
        id: args.id,
    }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \JoelButcher\Socialstream\Http\Controllers\Inertia\ConnectedAccountController::destroy
 * @see vendor/joelbutcher/socialstream/src/Http/Controllers/Inertia/ConnectedAccountController.php:19
 * @route /user/connected-account/{id}
 */
destroy.delete = (args: { id: string | number } | [id: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

export default destroy