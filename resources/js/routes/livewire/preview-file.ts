import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::previewFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
export const previewFile = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: previewFile.url(args, options),
    method: 'get',
})

previewFile.definition = {
    methods: ['get','head'],
    url: '\/livewire\/preview-file\/{filename}',
}

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::previewFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
previewFile.url = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { filename: args }
    }

    if (Array.isArray(args)) {
        args = {
            filename: args[0],
        }
    }

    const parsedArgs = {
        filename: args.filename,
    }

    return previewFile.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::previewFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
previewFile.get = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: previewFile.url(args, options),
    method: 'get',
})

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::previewFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
previewFile.head = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: previewFile.url(args, options),
    method: 'head',
})

export default previewFile