import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\LanguageController::LanguageController
 * @see app/Http/Controllers/LanguageController.php:13
 * @route /language
 */
const LanguageController = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LanguageController.url(options),
    method: 'post',
})

LanguageController.definition = {
    methods: ['post'],
    url: '\/language',
}

/**
 * @see \App\Http\Controllers\LanguageController::LanguageController
 * @see app/Http/Controllers/LanguageController.php:13
 * @route /language
 */
LanguageController.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return LanguageController.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\LanguageController::LanguageController
 * @see app/Http/Controllers/LanguageController.php:13
 * @route /language
 */
LanguageController.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: LanguageController.url(options),
    method: 'post',
})

export default LanguageController