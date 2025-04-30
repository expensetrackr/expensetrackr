<?php

declare(strict_types=1);

return [
    'free' => [
        'target_audience' => 'Para Todos',
        'title' => 'Gratis',
        'description' => 'Comienza con nuestro plan gratuito y descubre cómo funciona para ti.',
        'features' => 'Cuenta Financiera Única, Hasta 50 Transacciones/Mes, Personal Workspace, Resumen Básico de Gastos, 100 MB de Storage, Budgets Limitada, Categorización de Gastos',
        'button_label' => 'Empieza ahora'
    ],
    'personal' => [
        'target_audience' => 'Para Individuos',
        'title' => 'Personal',
        'description' => 'Desbloquea el seguimiento completo, herramientas de presupuestación potentes y análisis perspicaces para dominar tus finanzas personales.',
        'features' => 'Seguimiento Ilimitado de Gastos, Herramientas de Presupuestación Integrales, Gestión de Inversiones y Activos, Análisis Detallados, 5 GB de Storage',
        'button_label' => 'Suscríbete ahora'
    ],
    'lifetime' => [
        'target_audience' => 'Valor Máximo',
        'title' => 'De por Vida',
        'description' => 'Obtén acceso ilimitado y de por vida a todas las características del plan Personal con un único pago único.',
        'features' => 'Seguimiento Ilimitado de Gastos, Herramientas de Presupuestación Integrales, Gestión de Inversiones y Activos, Storage Ilimitado, Análisis Detallados, Pago Único',
        'button_label' => 'Obtén acceso de por vida'
    ],
    'enterprise' => [
        'target_audience' => 'Para Empresas en Crecimiento',
        'title' => 'Empresa',
        'description' => 'Características avanzadas, herramientas de colaboración y soporte dedicado para equipos.',
        'features' => 'Cuentas Financieras Ilimitadas, Workspaces Dedicados, Múltiples Asientos de Usuario, Informes Personalizables, Soporte Prioritario, <strong>Soporte SSO/SAML</strong>, <strong>SLA Personalizado</strong>',
        'button_label' => 'Hablar con ventas',
        'custom_price' => 'Personalizado'
    ],
    'simple_pricing' => 'Precios Simples',
    'interval_label' => 'Selección de intervalo de facturación',
    'suffix' => [
        'monthly' => '/mensual',
        'yearly' => '/facturado anualmente'
    ],
    'categories' => [
        'connectivity-integrations' => [
            'title' => 'Conectividad e Integraciones',
            'features' => [
                'bank-account-connections' => 'Conexiones Seguras a Cuentas Bancarias (a través de APIs)',
                'automated-receipt-data-extraction' => 'Extracción Automatizada de Datos de Recibos',
                'developer-api-access' => 'Acceso a la API para Desarrolladores'
            ]
        ],
        'comprehensive-tracking-management' => [
            'title' => 'Seguimiento y Gestión Integral',
            'features' => [
                'unlimited-expense-income-entries' => 'Entradas de Gastos e Ingresos Ilimitadas',
                'robust-budget-creation-tracking' => 'Creación y Seguimiento de Presupuestos Robustos',
                'effortless-investment-monitoring' => 'Monitoreo de Inversiones Sin Esfuerzo',
                'complete-asset-management' => 'Gestión Completa de Activos',
                'smart-categorization-flexible-tagging' => 'Categorización Inteligente y Etiquetado Flexible',
                'automated-recurring-transactions' => 'Transacciones Recurrentes Automatizadas',
                'multiple-currency-support' => 'Soporte para Múltiples Monedas'
            ]
        ],
        'data-insights' => [
            'title' => 'Datos e Información',
            'features' => [
                'interactive-analytics-dashboards' => 'Tableros de Análisis Interactivos',
                'advanced-financial-reporting' => 'Informes Financieros Avanzados',
                'custom-report-generation' => 'Generación de Informes Personalizados (PDF/CSV)'
            ]
        ],
        'organization-accessibility' => [
            'title' => 'Organización y Accesibilidad',
            'features' => [
                'manage-unlimited-financial-accounts' => 'Gestionar Cuentas Financieras Ilimitadas',
                'powerful-search-filtering-custom-views' => 'Búsqueda Potente, Filtrado y Vistas Personalizadas',
                'secure-cross-device-sync' => 'Sincronización Segura entre Dispositivos (PWA)',
                'receipt-document-storage' => 'Almacenamiento de Recibos y Documentos'
            ]
        ],
        'team-collaboration' => [
            'title' => 'Colaboración en Equipo',
            'features' => [
                'dedicated-collaborative-workspaces' => 'Espacios de Trabajo Colaborativos Dedicados',
                'included-user-seats' => 'Asientos de Usuario Incluidos'
            ]
        ],
        'security-enterprise-features' => [
            'title' => 'Seguridad y Características Empresariales',
            'features' => [
                'robust-security-features' => 'Características de Seguridad Robusta (2FA, Cifrado)',
                'sso-authentication-support' => 'Soporte de Autenticación SSO/SAML',
                'sla' => 'Acuerdo de Nivel de Servicio (SLA) Personalizado'
            ]
        ],
        'support-service' => [
            'title' => 'Soporte y Servicio',
            'features' => [
                'comprehensive-help-center-community-access' => 'Centro de Ayuda Integral y Acceso a la Comunidad',
                'dedicated-email-support' => 'Soporte por Correo Electrónico Dedicado',
                'dedicated-account-manager' => 'Gerente de Cuenta Dedicado'
            ]
        ],
        'billing-options' => [
            'title' => 'Opciones de Facturación',
            'features' => [
                'monthly-billing' => 'Facturación Mensual',
                'annual-billing-discount' => 'Descuento por Facturación Anual',
                'one-time-purchase-option' => 'Opción de Compra Única',
                'credit-card-payment' => 'Pago con Tarjeta de Crédito',
                'bank-transfer-payment-option' => 'Opción de Pago por Transferencia Bancaria'
            ]
        ]
    ]
];
