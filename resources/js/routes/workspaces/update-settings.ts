import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \App\Http\Controllers\WorkspaceSettingController::updateSettings
 * @see app/Http/Controllers/WorkspaceSettingController.php:20
 * @route /workspaces/{workspace}/settings/{settings}
 */
export const updateSettings = (args: { workspace: string | { public_id: string }, settings: string | { public_id: string } } | [workspace: string | { public_id: string }, settings: string | { public_id: string }], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: updateSettings.url(args, options),
    method: 'put',
})

updateSettings.definition = {
    methods: ['put'],
    url: '\/workspaces\/{workspace}\/settings\/{settings}',
}

/**
 * @see \App\Http\Controllers\WorkspaceSettingController::updateSettings
 * @see app/Http/Controllers/WorkspaceSettingController.php:20
 * @route /workspaces/{workspace}/settings/{settings}
 */
updateSettings.url = (args: { workspace: string | { public_id: string }, settings: string | { public_id: string } } | [workspace: string | { public_id: string }, settings: string | { public_id: string }], options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return updateSettings.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{settings}', parsedArgs.settings.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \App\Http\Controllers\WorkspaceSettingController::updateSettings
 * @see app/Http/Controllers/WorkspaceSettingController.php:20
 * @route /workspaces/{workspace}/settings/{settings}
 */
updateSettings.put = (args: { workspace: string | { public_id: string }, settings: string | { public_id: string } } | [workspace: string | { public_id: string }, settings: string | { public_id: string }], options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'put',
} => ({
    url: updateSettings.url(args, options),
    method: 'put',
})

export default updateSettings