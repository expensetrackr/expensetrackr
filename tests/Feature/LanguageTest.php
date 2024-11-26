<?php

it('sets the language correctly', function () {
    $response = $this->post('/language', [
        'language' => $language = 'es'
    ]);

    $response->assertSessionHas('language', $language)->assertStatus(303);
});

it('sets the default language if the chosen language does not exist', function () {
    $response = $this->post('/language', [
        'language' => 'de'
    ]);

    $response->assertSessionHas('language', config('app.locale'))->assertStatus(303);
});
