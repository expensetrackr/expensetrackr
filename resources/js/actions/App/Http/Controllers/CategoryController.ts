import { queryParams, type QueryParams } from './../../../../wayfinder'

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

/**
 * @see \App\Http\Controllers\CategoryController::update
 * @see app/Http/Controllers/CategoryController.php:62
 * @route /categories/{category}
 */
export const update = (args: { category: string | { public_id: string } } | [category: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/categories\/{category}',
}

/**
 * @see \App\Http\Controllers\CategoryController::update
 * @see app/Http/Controllers/CategoryController.php:62
 * @route /categories/{category}
 */
update.url = (args: { category: string | { public_id: string } } | [category: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { category: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    const parsedArgs = {
        category: typeof args.category === 'object'
            ? args.category.public_id
            : args.category,
    }

    return update.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\CategoryController::update
 * @see app/Http/Controllers/CategoryController.php:62
 * @route /categories/{category}
 */
update.put = (args: { category: string | { public_id: string } } | [category: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

/**
 * @see \App\Http\Controllers\CategoryController::destroy
 * @see app/Http/Controllers/CategoryController.php:75
 * @route /categories/{category}
 */
export const destroy = (args: { category: string | { public_id: string } } | [category: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/categories\/{category}',
}

/**
 * @see \App\Http\Controllers\CategoryController::destroy
 * @see app/Http/Controllers/CategoryController.php:75
 * @route /categories/{category}
 */
destroy.url = (args: { category: string | { public_id: string } } | [category: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { category: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            category: args[0],
        }
    }

    const parsedArgs = {
        category: typeof args.category === 'object'
            ? args.category.public_id
            : args.category,
    }

    return destroy.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\CategoryController::destroy
 * @see app/Http/Controllers/CategoryController.php:75
 * @route /categories/{category}
 */
destroy.delete = (args: { category: string | { public_id: string } } | [category: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

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

const CategoryController = { store, update, destroy, index }

export default CategoryController