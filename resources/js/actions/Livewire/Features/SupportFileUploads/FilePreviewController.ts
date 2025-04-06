import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
export const handle = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: handle.url(args, options),
    method: 'get',
})

handle.definition = {
    methods: ['get','head'],
    url: '\/livewire\/preview-file\/{filename}',
}

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
handle.url = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
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

    return handle.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
handle.get = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: handle.url(args, options),
    method: 'get',
})

/**
 * @see \Livewire\Features\SupportFileUploads\FilePreviewController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FilePreviewController.php:18
 * @route /livewire/preview-file/{filename}
 */
handle.head = (args: { filename: string | number } | [filename: string | number] | string | number, options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: handle.url(args, options),
    method: 'head',
})

const FilePreviewController = { handle }

export default FilePreviewController