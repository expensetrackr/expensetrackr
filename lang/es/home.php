<?php

declare(strict_types=1);

return [
    'image_and_text_section' => [
        'title' => '¡Comienza a dominar tus finanzas en solo unos pocos pasos!',
        'steps' => [
            '1' => [
                'title' => 'Conecta tus cuentas',
                'description' => 'Todo comienza aquí. Conecta tus cuentas bancarias y comienza a sincronizar tus transacciones al instante.',
            ],
            '2' => [
                'title' => 'Organiza y categoriza',
                'description' => 'Pon orden en tu dinero. Clasifica tus gastos e ingresos en categorías que realmente te sirvan.',
            ],
            '3' => [
                'title' => 'Establece tus metas',
                'description' => 'Visualiza el éxito. Define metas claras para ahorrar, pagar deudas o controlar tus gastos.',
            ],
            '4' => [
                'title' => 'Analiza tus finanzas',
                'description' => 'Descubre la imagen completa. Utiliza gráficos y reportes detallados para tomar mejores decisiones.',
            ],
            '5' => [
                'title' => 'Colabora en equipo',
                'description' => 'No estás solo. Crea espacios de trabajo, invita a tu equipo y trabaja juntos para gestionar tus finanzas.',
            ],
        ],
    ],
    'sections' => [
        'pricing' => [
            'title' => 'Mejora tus finanzas',
            'description' => 'Elige el plan que mejor se adapte a tus necesidades. Ofrecemos una prueba gratuita para todos nuestros planes.',
            'coming_soon' => 'Más pronto',
            'plans' => [
                'free' => [
                    'title' => 'Gratis',
                    'description' => 'Para usuarios individuales que quieren tomar el control de sus finanzas',
                    'features' => 'Espacio de trabajo personal, Hasta 3 cuentas, Hasta 15 transacciones por mes, Categorías predeterminadas, Hasta 30 días de historial gráfico, Cuentas manuales',
                    'coming_soon' => ' ',
                    'button_label' => 'Comienza gratis',
                ],
                'analyst' => [
                    'title' => 'Analista',
                    'description' => 'Para equipos pequeños y grandes (o familias) o incluso usuarios individuales que quieren tomar el control de sus finanzas',
                    'features' => 'Espacios de trabajo y miembros ilimitados, Cuentas y transacciones ilimitadas, Archivos adjuntos para transacciones, Categorías predeterminadas y personalizadas, Historial gráfico personalizado, <strong>Importaciones CSV</strong>, <strong>Múltiples divisas</strong>',
                    'coming_soon' => 'Conecta tus cuentas bancarias',
                    'button_label' => 'Suscríbete ahora',
                ],
                'lifetime' => [
                    'title' => 'De por vida',
                    'description' => 'Para equipos, familias o usuarios individuales que quieren tomar el control de sus finanzas y nunca volver a pagar',
                    'features' => '<strong>Todas las características del plan Analista</strong>, <strong>Todas las características futuras</strong>, Sin pagos recurrentes, Soporte prioritario',
                    'coming_soon' => ' ',
                    'button_label' => 'Compra ahora ',
                ],
            ],
        ],
    ],
];
