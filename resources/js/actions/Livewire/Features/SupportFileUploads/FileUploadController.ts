import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \Livewire\Features\SupportFileUploads\FileUploadController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FileUploadController.php:22
 * @route /livewire/upload-file
 */
export const handle = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: handle.url(options),
    method: 'post',
})

handle.definition = {
    methods: ['post'],
    url: '\/livewire\/upload-file',
}

/**
 * @see \Livewire\Features\SupportFileUploads\FileUploadController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FileUploadController.php:22
 * @route /livewire/upload-file
 */
handle.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return handle.definition.url + queryParams(options)
}

/**
 * @see \Livewire\Features\SupportFileUploads\FileUploadController::handle
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FileUploadController.php:22
 * @route /livewire/upload-file
 */
handle.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: handle.url(options),
    method: 'post',
})

const FileUploadController = { handle }

export default FileUploadController