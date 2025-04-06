import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:133
 * @route /transactions/{transaction}
 */
export const update = (args: { transaction: string | { public_id: string } } | [transaction: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/transactions\/{transaction}',
}

/**
 * @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:133
 * @route /transactions/{transaction}
 */
update.url = (args: { transaction: string | { public_id: string } } | [transaction: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { transaction: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            transaction: args[0],
        }
    }

    const parsedArgs = {
        transaction: typeof args.transaction === 'object'
            ? args.transaction.public_id
            : args.transaction,
    }

    return update.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\TransactionController::update
 * @see app/Http/Controllers/TransactionController.php:133
 * @route /transactions/{transaction}
 */
update.put = (args: { transaction: string | { public_id: string } } | [transaction: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

export default update