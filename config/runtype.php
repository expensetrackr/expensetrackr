<?php

declare(strict_types=1);

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Vagebond\Runtype\Converters\ModelConverter;
use Vagebond\Runtype\Converters\ResourceConverter;
use Vagebond\Runtype\Processors\ModelProcessor;
use Vagebond\Runtype\Processors\ResourceProcessor;

return [
    /**
     * The paths where runtype will look for resources
     */
    'auto_discover_paths' => [
        app_path('Http/Resources'),
    ],

    /**
     * Hooks allow you to add custom logic to the generation process
     * Each hook must implement the Vagebond\Runtype\Contracts\Hookable interface
     *
     * i.e. you can use the before hook to setup specific settings for your environment
     * like logging in a user, setting a tenant etc.
     *
     * You can also use the after hook to do some cleanup or to format the generated
     * typescript file
     */
    'hooks' => [
        // 'App\Hooks\SetupEnvironmentHook',
    ],

    /**
     * Indicate how you would like your entities to be processed
     * you can choose a subclass or an interface
     */
    'processors' => [
        JsonResource::class => ResourceProcessor::class,
        Model::class => ModelProcessor::class,
    ],

    /**
     * Indicate how you would like your entities to be converted
     * into Typescript types
     */
    'converters' => [
        JsonResource::class => ResourceConverter::class,
        Model::class => ModelConverter::class,
    ],

    /**
     * There are certain situations where runtype can't determine the
     * required settings for a resource, i.e. when conditionally loading attributes,
     * You can use a modifier to set the required settings on your model so our
     * resource generator can detect them.
     */
    'modifiers' => [
        //
    ],

    /*
     * In your classes, you sometimes have types that should always be replaced
     * by the same TypeScript representations. For example, you can replace a
     * Datetime always with a string. You define these replacements here.
     */

    'type_replacements' => [
        DateTimeImmutable::class => 'string',
        Carbon::class => 'string',
        CarbonImmutable::class => 'string',
    ],

    /**
     * runtype will write the generated Typescript to this file
     */
    'output_file' => resource_path('js/types/runtype.d.ts'),
];
