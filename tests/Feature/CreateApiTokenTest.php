<?php

declare(strict_types=1);

use App\Models\User;
use Workspaces\Features;

test('api tokens can be created', function () {
    if (Features::hasWorkspaceFeatures()) {
        $this->actingAs($user = User::factory()->withPersonalWorkspace()->create());
    } else {
        $this->actingAs($user = User::factory()->create());
    }

    $this->post('/user/api-tokens', [
        'name' => 'Test Token',
        'permissions' => [
            'read',
            'update',
        ],
    ]);

    expect($user->fresh()->tokens)->toHaveCount(1)
        ->and($user->fresh()->tokens->first())
        ->name->toEqual('Test Token')
        ->can('read')->toBeTrue()
        ->can('delete')->toBeFalse();
})->skip(function () {
    return ! Features::hasApiFeatures();
}, 'API support is not enabled.');
