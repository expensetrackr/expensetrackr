import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:33
 * @route /transactions
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
    url: '\/transactions',
}

/**
 * @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:33
 * @route /transactions
 */
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:33
 * @route /transactions
 */
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\TransactionController::index
 * @see app/Http/Controllers/TransactionController.php:33
 * @route /transactions
 */
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:86
 * @route /transactions/create
 */
export const create = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ['get','head'],
    url: '\/transactions\/create',
}

/**
 * @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:86
 * @route /transactions/create
 */
create.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return create.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:86
 * @route /transactions/create
 */
create.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\TransactionController::create
 * @see app/Http/Controllers/TransactionController.php:86
 * @route /transactions/create
 */
create.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: create.url(options),
    method: 'head',
})

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

/**
 * @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:140
 * @route /transactions/{transaction}
 */
export const destroy = (args: { transaction: string | { public_id: string } } | [transaction: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/transactions\/{transaction}',
}

/**
 * @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:140
 * @route /transactions/{transaction}
 */
destroy.url = (args: { transaction: string | { public_id: string } } | [transaction: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return destroy.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\TransactionController::destroy
 * @see app/Http/Controllers/TransactionController.php:140
 * @route /transactions/{transaction}
 */
destroy.delete = (args: { transaction: string | { public_id: string } } | [transaction: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const TransactionController = { index, create, store, update, destroy }

export default TransactionController