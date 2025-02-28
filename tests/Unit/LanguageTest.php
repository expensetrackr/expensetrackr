<?php

declare(strict_types=1);

it('can get an associated language label', function () {
    expect(LanguageData::from('en')->getLabel())->toBe('English');
});
