import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\CategoryController::store
 * @see app/Http/Controllers/CategoryController.php:49
 * @route /categories
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
    url: '\/categories',
}

/**
 * @see \App\Http\Controllers\CategoryController::store
 * @see app/Http/Controllers/CategoryController.php:49
 * @route /categories
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\CategoryController::store
 * @see app/Http/Controllers/CategoryController.php:49
 * @route /categories
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

export default store