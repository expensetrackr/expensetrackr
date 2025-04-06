import store from './store'
import update from './update'
import destroy from './destroy'
import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\CategoryController::index
 * @see app/Http/Controllers/CategoryController.php:25
 * @route /settings/categories
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
    url: '\/settings\/categories',
}

/**
 * @see \App\Http\Controllers\CategoryController::index
 * @see app/Http/Controllers/CategoryController.php:25
 * @route /settings/categories
 */
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\CategoryController::index
 * @see app/Http/Controllers/CategoryController.php:25
 * @route /settings/categories
 */
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\CategoryController::index
 * @see app/Http/Controllers/CategoryController.php:25
 * @route /settings/categories
 */
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

const categories = {
    store, 
    update, 
    destroy, 
    index,
}

export default categories