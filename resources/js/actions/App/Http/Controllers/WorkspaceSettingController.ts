import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceSettingController::update
 * @see app/Http/Controllers/WorkspaceSettingController.php:20
 * @route /workspaces/{workspace}/settings/{settings}
 */
export const update = (args: { workspace: string | { public_id: string }, settings: string | { public_id: string } } | [workspace: string | { public_id: string }, settings: string | { public_id: string }], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ['put'],
    url: '\/workspaces\/{workspace}\/settings\/{settings}',
}

/**
 * @see \App\Http\Controllers\WorkspaceSettingController::update
 * @see app/Http/Controllers/WorkspaceSettingController.php:20
 * @route /workspaces/{workspace}/settings/{settings}
 */
update.url = (args: { workspace: string | { public_id: string }, settings: string | { public_id: string } } | [workspace: string | { public_id: string }, settings: string | { public_id: string }], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            settings: args[1],
        }
    }

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
            ? args.workspace.public_id
            : args.workspace,
        settings: typeof args.settings === 'object'
            ? args.settings.public_id
            : args.settings,
    }

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{settings}', parsedArgs.settings.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceSettingController::update
 * @see app/Http/Controllers/WorkspaceSettingController.php:20
 * @route /workspaces/{workspace}/settings/{settings}
 */
update.put = (args: { workspace: string | { public_id: string }, settings: string | { public_id: string } } | [workspace: string | { public_id: string }, settings: string | { public_id: string }], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: update.url(args, options),
    method: 'put',
})

const WorkspaceSettingController = { update }

export default WorkspaceSettingController