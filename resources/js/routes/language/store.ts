import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\LanguageController::store
 * @see app/Http/Controllers/LanguageController.php:13
 * @route /language
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
    url: '\/language',
}

/**
 * @see \App\Http\Controllers\LanguageController::store
 * @see app/Http/Controllers/LanguageController.php:13
 * @route /language
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\LanguageController::store
 * @see app/Http/Controllers/LanguageController.php:13
 * @route /language
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

export default store