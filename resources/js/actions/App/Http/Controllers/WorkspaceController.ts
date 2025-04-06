import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceController::create
 * @see app/Http/Controllers/WorkspaceController.php:68
 * @route /workspaces/create
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
    url: '\/workspaces\/create',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::create
 * @see app/Http/Controllers/WorkspaceController.php:68
 * @route /workspaces/create
 */
create.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return create.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::create
 * @see app/Http/Controllers/WorkspaceController.php:68
 * @route /workspaces/create
 */
create.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: create.url(options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::create
 * @see app/Http/Controllers/WorkspaceController.php:68
 * @route /workspaces/create
 */
create.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: create.url(options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::store
 * @see app/Http/Controllers/WorkspaceController.php:56
 * @route /workspaces
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
    url: '\/workspaces',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::store
 * @see app/Http/Controllers/WorkspaceController.php:56
 * @route /workspaces
 */
store.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return store.definition.url + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::store
 * @see app/Http/Controllers/WorkspaceController.php:56
 * @route /workspaces
 */
store.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(options),
    method: 'post',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
export const show = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ['get','head'],
    url: '\/workspaces\/{workspace}',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
show.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { workspace: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
    }

    return show.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
show.get = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: show.url(args, options),
    method: 'get',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::show
 * @see app/Http/Controllers/WorkspaceController.php:34
 * @route /workspaces/{workspace}
 */
show.head = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: show.url(args, options),
    method: 'head',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::update
 * @see app/Http/Controllers/WorkspaceController.php:80
 * @route /workspaces/{workspace}
 */
export const update = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/workspaces\/{workspace}',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::update
 * @see app/Http/Controllers/WorkspaceController.php:80
 * @route /workspaces/{workspace}
 */
update.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { workspace: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
    }

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::update
 * @see app/Http/Controllers/WorkspaceController.php:80
 * @route /workspaces/{workspace}
 */
update.put = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

/**
 * @see \App\Http\Controllers\WorkspaceController::destroy
 * @see app/Http/Controllers/WorkspaceController.php:90
 * @route /workspaces/{workspace}
 */
export const destroy = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/workspaces\/{workspace}',
}

/**
 * @see \App\Http\Controllers\WorkspaceController::destroy
 * @see app/Http/Controllers/WorkspaceController.php:90
 * @route /workspaces/{workspace}
 */
destroy.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { workspace: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
    }

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceController::destroy
 * @see app/Http/Controllers/WorkspaceController.php:90
 * @route /workspaces/{workspace}
 */
destroy.delete = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const WorkspaceController = { create, store, show, update, destroy }

export default WorkspaceController