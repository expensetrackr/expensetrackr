import { queryParams, type QueryParams } from './../../../../wayfinder'

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::returnJavaScriptAsFile
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:78
 * @route /livewire/livewire.js
 */
export const returnJavaScriptAsFile = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: returnJavaScriptAsFile.url(options),
    method: 'get',
})

returnJavaScriptAsFile.definition = {
    methods: ['get','head'],
    url: '\/livewire\/livewire.js',
}

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::returnJavaScriptAsFile
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:78
 * @route /livewire/livewire.js
 */
returnJavaScriptAsFile.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return returnJavaScriptAsFile.definition.url + queryParams(options)
}

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::returnJavaScriptAsFile
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:78
 * @route /livewire/livewire.js
 */
returnJavaScriptAsFile.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: returnJavaScriptAsFile.url(options),
    method: 'get',
})

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::returnJavaScriptAsFile
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:78
 * @route /livewire/livewire.js
 */
returnJavaScriptAsFile.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: returnJavaScriptAsFile.url(options),
    method: 'head',
})

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::maps
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:87
 * @route /livewire/livewire.min.js.map
 */
export const maps = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: maps.url(options),
    method: 'get',
})

maps.definition = {
    methods: ['get','head'],
    url: '\/livewire\/livewire.min.js.map',
}

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::maps
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:87
 * @route /livewire/livewire.min.js.map
 */
maps.url = (options?: { query?: QueryParams, mergeQuery?: QueryParams }) => {
    return maps.definition.url + queryParams(options)
}

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::maps
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:87
 * @route /livewire/livewire.min.js.map
 */
maps.get = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'get',
} => ({
    url: maps.url(options),
    method: 'get',
})

/**
 * @see \Livewire\Mechanisms\FrontendAssets\FrontendAssets::maps
 * @see vendor/livewire/livewire/src/Mechanisms/FrontendAssets/FrontendAssets.php:87
 * @route /livewire/livewire.min.js.map
 */
maps.head = (options?: { query?: QueryParams, mergeQuery?: QueryParams }): {
    url: string,
    method: 'head',
} => ({
    url: maps.url(options),
    method: 'head',
})

const FrontendAssets = { returnJavaScriptAsFile, maps }

export default FrontendAssets