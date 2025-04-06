import store from './store'
import update from './update'
import destroy from './destroy'
import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
export const index = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ['get','head'],
    url: '\/user\/api-tokens',
}

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\ApiTokenController::index
 * @see app/Http/Controllers/ApiTokenController.php:17
 * @route /user/api-tokens
 */
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

const apiTokens = {
    index, 
    store, 
    update, 
    destroy,
}

export default apiTokens