<?php

declare(strict_types=1);

return [
    'fields' => [
        'email' => [
            'label' => 'Correo electrónico',
            'placeholder' => 'p. ej. john@example.com',
        ],
        'password' => [
            'label' => 'Introduce tu contraseña',
            'placeholder' => 'p. ej. **********',
        ],
        'remember' => [
            'label' => 'Recuérdame',
        ],
        'initial_balance' => [
            'label' => 'Saldo inicial',
            'placeholder' => 'p. ej. 1.00',
        ],
        'available_balance' => [
            'label' => 'Crédito disponible',
            'placeholder' => 'p. ej. 1.00',
        ],
        'minimum_payment' => [
            'label' => 'Pago mínimo',
            'placeholder' => 'p. ej. 1.00',
        ],
        'apr' => [
            'label' => 'Tasa de interés anual (APR)',
            'placeholder' => '10',
        ],
        'expires_at' => [
            'label' => 'Expira el',
            'placeholder' => 'Selecciona una fecha',
        ],
        'interest_rate' => [
            'label' => 'Tasa de interés',
            'placeholder' => 'p. ej. 1.00',
        ],
        'interest_rate_type' => [
            'label' => 'Tipo de tasa',
            'placeholder' => 'Selecciona un tipo de tasa',
        ],
        'term_months' => [
            'label' => 'Plazo (meses)',
            'placeholder' => '48',
        ],
        'name' => [
            'label' => 'Nombre',
            'placeholder' => 'p. ej. John Doe',
        ],
        'new_password' => [
            'label' => 'Nueva contraseña',
            'placeholder' => '8+ caracteres, 1 letra mayúscula',
            'hint' => 'Debe tener al menos 8 caracteres',
        ],
        'confirm_password' => [
            'label' => 'Confirmar contraseña',
            'placeholder' => 'Confirma tu contraseña',
        ],
    ],
];
