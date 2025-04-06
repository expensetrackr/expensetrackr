import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:119
 * @route /transactions
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
    url: '\/transactions',
}

/**
 * @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:119
 * @route /transactions
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\TransactionController::store
 * @see app/Http/Controllers/TransactionController.php:119
 * @route /transactions
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

export default store