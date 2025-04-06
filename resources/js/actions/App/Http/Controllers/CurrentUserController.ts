import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\CurrentUserController::destroy
 * @see app/Http/Controllers/CurrentUserController.php:21
 * @route /user
 */
export const destroy = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/user',
}

/**
 * @see \App\Http\Controllers\CurrentUserController::destroy
 * @see app/Http/Controllers/CurrentUserController.php:21
 * @route /user
 */
destroy.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return destroy.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\CurrentUserController::destroy
 * @see app/Http/Controllers/CurrentUserController.php:21
 * @route /user
 */
destroy.delete = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(options),
    method: 'delete',
})

const CurrentUserController = { destroy }

export default CurrentUserController