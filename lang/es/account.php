<?php

declare(strict_types=1);

return [
    'type' => [
        'depository' => 'Depósito',
        'investment' => 'Inversión',
        'crypto' => 'Cripto',
        'credit_card' => 'Tarjeta de Crédito',
        'loan' => 'Préstamo',
        'other_asset' => 'Otro Activo',
        'other_liability' => 'Otra Obligación'
    ],
    'form' => [
        'name' => [
            'label' => 'Nombre',
            'placeholder' => 'p. ej. Ahorros personales'
        ],
        'description' => [
            'label' => 'Descripción',
            'placeholder' => 'p. ej. Cuenta de ahorros para gastos personales',
            'hint' => 'Esto solo será visible para ti.',
            'labelSub' => '(Opcional)'
        ],
        'type' => [
            'label' => 'Tipo',
            'placeholder' => 'Selecciona un tipo'
        ],
        'subtype' => [
            'label' => 'Subtipo',
            'labelSub' => '(Opcional)',
            'placeholder' => 'Selecciona un subtipo'
        ],
        'initial_balance' => [
            'label' => 'Saldo inicial',
            'placeholder' => 'p. ej. 1.00'
        ],
        'available_balance' => [
            'label' => 'Crédito disponible',
            'placeholder' => 'p. ej. 1.00'
        ],
        'minimum_payment' => [
            'label' => 'Pago mínimo',
            'placeholder' => 'p. ej. 1.00'
        ],
        'apr' => [
            'label' => 'Tasa de interés anual (APR)',
            'placeholder' => '10'
        ],
        'expires_at' => [
            'label' => 'Expira el',
            'labelSub' => '(Opcional)',
            'placeholder' => 'Selecciona una fecha'
        ],
        'annual_fee' => [
            'label' => 'Cuota anual',
            'placeholder' => 'p. ej. 1.00'
        ],
        'interest_rate' => [
            'label' => 'Tasa de interés',
            'placeholder' => 'p. ej. 1.00'
        ],
        'interest_rate_type' => [
            'label' => 'Tipo de tasa',
            'placeholder' => 'Selecciona un tipo de tasa'
        ],
        'term_months' => [
            'label' => 'Plazo (meses)',
            'placeholder' => '48'
        ]
    ],
    'create' => [
        'title' => 'Crear cuenta',
        'information' => 'Información',
        'details' => 'Detalles',
        'balance' => 'Saldo',
        'currency' => 'Moneda',
        'discard' => 'Descartar',
        'submit' => 'Crear cuenta',
        'submit_loading' => 'Creando cuenta...'
    ]
];
