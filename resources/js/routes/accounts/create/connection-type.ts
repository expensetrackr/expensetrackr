import { queryParams, type QueryParams } from './../../../wayfinder'

/**
 * @see \App\Http\Controllers\AccountController::connectionType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
export const connectionType = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: connectionType.url(args, options),
    method: 'get',
})

connectionType.definition = {
    methods: ['get','head'],
    url: '\/accounts\/create\/{connectionType}',
}

/**
 * @see \App\Http\Controllers\AccountController::connectionType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
connectionType.url = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connectionType: args }
    }

    if (Array.isArray(args)) {
        args = {
            connectionType: args[0],
        }
    }

    const parsedArgs = {
        connectionType: args.connectionType,
    }

    return connectionType.definition.url
            .replace('{connectionType}', parsedArgs.connectionType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::connectionType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
connectionType.get = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: connectionType.url(args, options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\AccountController::connectionType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
connectionType.head = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: connectionType.url(args, options),
    method: 'head',
})

export default connectionType