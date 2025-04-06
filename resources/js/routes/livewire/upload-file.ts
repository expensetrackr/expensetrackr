import { queryParams, type QueryParams } from './../../wayfinder'

/**
 * @see \Livewire\Features\SupportFileUploads\FileUploadController::uploadFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FileUploadController.php:22
 * @route /livewire/upload-file
 */
export const uploadFile = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: uploadFile.url(options),
    method: 'post',
})

uploadFile.definition = {
    methods: ['post'],
    url: '\/livewire\/upload-file',
}

/**
 * @see \Livewire\Features\SupportFileUploads\FileUploadController::uploadFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FileUploadController.php:22
 * @route /livewire/upload-file
 */
uploadFile.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return uploadFile.definition.url + queryParams(options)
}

/**
 * @see \Livewire\Features\SupportFileUploads\FileUploadController::uploadFile
 * @see vendor/livewire/livewire/src/Features/SupportFileUploads/FileUploadController.php:22
 * @route /livewire/upload-file
 */
uploadFile.post = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'post',
} => ({
    url: uploadFile.url(options),
    method: 'post',
})

export default uploadFile