import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::store
 * @see app/Http/Controllers/WorkspaceMemberController.php:26
 * @route /workspaces/{workspace}/members
 */
export const store = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ['post'],
    url: '\/workspaces\/{workspace}\/members',
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::store
 * @see app/Http/Controllers/WorkspaceMemberController.php:26
 * @route /workspaces/{workspace}/members
 */
store.url = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return store.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::store
 * @see app/Http/Controllers/WorkspaceMemberController.php:26
 * @route /workspaces/{workspace}/members
 */
store.post = (args: { workspace: string | { public_id: string } } | [workspace: string | { public_id: string }] | string | { public_id: string }, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: store.url(args, options),
    method: 'post',
})

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::update
 * @see app/Http/Controllers/WorkspaceMemberController.php:44
 * @route /workspaces/{workspace}/members/{user}
 */
export const update = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/workspaces\/{workspace}\/members\/{user}',
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::update
 * @see app/Http/Controllers/WorkspaceMemberController.php:44
 * @route /workspaces/{workspace}/members/{user}
 */
update.url = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            user: args[1],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
        user: args.user,
    }

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::update
 * @see app/Http/Controllers/WorkspaceMemberController.php:44
 * @route /workspaces/{workspace}/members/{user}
 */
update.put = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::destroy
 * @see app/Http/Controllers/WorkspaceMemberController.php:62
 * @route /workspaces/{workspace}/members/{user}
 */
export const destroy = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ['delete'],
    url: '\/workspaces\/{workspace}\/members\/{user}',
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::destroy
 * @see app/Http/Controllers/WorkspaceMemberController.php:62
 * @route /workspaces/{workspace}/members/{user}
 */
destroy.url = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            user: args[1],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
        user: args.user,
    }

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceMemberController::destroy
 * @see app/Http/Controllers/WorkspaceMemberController.php:62
 * @route /workspaces/{workspace}/members/{user}
 */
destroy.delete = (args: { workspace: string | { public_id: string }, user: string | number } | [workspace: string | { public_id: string }, user: string | number], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'delete',
} => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const WorkspaceMemberController = { store, update, destroy }

export default WorkspaceMemberController