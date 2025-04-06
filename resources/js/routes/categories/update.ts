import { queryParams, type QueryParams } from './../../wayfinder'

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

export default update