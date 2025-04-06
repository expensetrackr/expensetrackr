import { queryParams, type QueryParams } from './../../../../../wayfinder'

/**
 * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
 * @route /email/verify/{id}/{hash}
 */
export const __invoke = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: __invoke.url(args, options),
    method: 'get',
})

__invoke.definition = {
    methods: ['get','head'],
    url: '\/email\/verify\/{id}\/{hash}',
}

/**
 * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
 * @route /email/verify/{id}/{hash}
 */
__invoke.url = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (Array.isArray(args)) {
        args = {
            id: args[0],
            hash: args[1],
        }
    }

    const parsedArgs = {
        id: args.id,
        hash: args.hash,
    }

    return __invoke.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{hash}', parsedArgs.hash.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
 * @route /email/verify/{id}/{hash}
 */
__invoke.get = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: __invoke.url(args, options),
    method: 'get',
})

/**
 * @see \Laravel\Fortify\Http\Controllers\VerifyEmailController::__invoke
 * @see vendor/laravel/fortify/src/Http/Controllers/VerifyEmailController.php:18
 * @route /email/verify/{id}/{hash}
 */
__invoke.head = (args: { id: string | number, hash: string | number } | [id: string | number, hash: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: __invoke.url(args, options),
    method: 'head',
})

const VerifyEmailController = { __invoke }

export default VerifyEmailController