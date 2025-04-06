import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:157
 * @route /accounts
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
    url: '\/accounts',
}

/**
 * @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:157
 * @route /accounts
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::store
 * @see app/Http/Controllers/AccountController.php:157
 * @route /accounts
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

/**
 * @see \App\Http\Controllers\AccountController::storeBankConnections
 * @see app/Http/Controllers/AccountController.php:137
 * @route /accounts/bank-connections
 */
export const storeBankConnections = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: storeBankConnections.url(options),
    method: 'post',
})

storeBankConnections.definition = {
    methods: ['post'],
    url: '\/accounts\/bank-connections',
}

/**
 * @see \App\Http\Controllers\AccountController::storeBankConnections
 * @see app/Http/Controllers/AccountController.php:137
 * @route /accounts/bank-connections
 */
storeBankConnections.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return storeBankConnections.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::storeBankConnections
 * @see app/Http/Controllers/AccountController.php:137
 * @route /accounts/bank-connections
 */
storeBankConnections.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: storeBankConnections.url(options),
    method: 'post',
})

/**
 * @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:34
 * @route /accounts
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
    url: '\/accounts',
}

/**
 * @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:34
 * @route /accounts
 */
index.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:34
 * @route /accounts
 */
index.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: index.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\AccountController::index
 * @see app/Http/Controllers/AccountController.php:34
 * @route /accounts
 */
index.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: index.url(options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\AccountController::create
 * @see app/Http/Controllers/AccountController.php:87
 * @route /accounts/create
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
    url: '\/accounts\/create',
}

/**
 * @see \App\Http\Controllers\AccountController::create
 * @see app/Http/Controllers/AccountController.php:87
 * @route /accounts/create
 */
create.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return create.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::create
 * @see app/Http/Controllers/AccountController.php:87
 * @route /accounts/create
 */
create.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\AccountController::create
 * @see app/Http/Controllers/AccountController.php:87
 * @route /accounts/create
 */
create.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: create.url(options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\AccountController::createAccountByType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
export const createAccountByType = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: createAccountByType.url(args, options),
    method: 'get',
})

createAccountByType.definition = {
    methods: ['get','head'],
    url: '\/accounts\/create\/{connectionType}',
}

/**
 * @see \App\Http\Controllers\AccountController::createAccountByType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
createAccountByType.url = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { connectionType: args }
    }

    if (Array.isArray(args)) {
        args = {
            connectionType: args[0],
        }
    }

    const parsedArgs = {
        connectionType: args.connectionType,
    }

    return createAccountByType.definition.url
            .replace('{connectionType}', parsedArgs.connectionType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\AccountController::createAccountByType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
createAccountByType.get = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: createAccountByType.url(args, options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\AccountController::createAccountByType
 * @see app/Http/Controllers/AccountController.php:99
 * @route /accounts/create/{connectionType}
 */
createAccountByType.head = (args: { connectionType: string | number } | [connectionType: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: createAccountByType.url(args, options),
    method: 'head',
})

const AccountController = { store, storeBankConnections, index, create, createAccountByType }

export default AccountController