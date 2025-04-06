import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\ApiTokenController::store
 * @see app/Http/Controllers/ApiTokenController.php:29
 * @route /user/api-tokens
 */
export const store = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '\/user\/api-tokens',
}

/**
 * @see \App\Http\Controllers\ApiTokenController::store
 * @see app/Http/Controllers/ApiTokenController.php:29
 * @route /user/api-tokens
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ApiTokenController::store
 * @see app/Http/Controllers/ApiTokenController.php:29
 * @route /user/api-tokens
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

export default store