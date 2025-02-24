<?php

declare(strict_types=1);

return [
    'failed' => 'Estas credenciales no coinciden con nuestros registros.',
    'password' => 'La contraseña proporcionada es incorrecta.',
    'throttle' => 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo en :seconds segundos.',
    'actions' => [
        'dont_have_account' => '¿No tienes una cuenta?',
        'register' => 'Registrarse',
        'already_have_account' => '¿Ya tienes una cuenta?',
        'login' => 'Iniciar sesión',
        'changed_mind' => '¿Cambiastes de opinión?',
    ],
    'confirm_password' => [
        'description' => 'Esta es un área segura de la aplicación. Por favor, confirma tu contraseña antes de continuar.',
        'actions' => [
            'submit' => [
                'label' => 'Confirmar',
            ],
        ],
    ],
    'forgot_password' => [
        'title' => 'Olvidé la contraseña',
        'description' => 'Ingresa tu correo electrónico para restablecer tu contraseña.',
        'actions' => [
            'submit' => [
                'label' => 'Enviar enlace para restablecer la contraseña por correo electrónico',
            ],
        ],
    ],
    'login' => [
        'title' => 'Inicia sesión en tu cuenta',
        'description' => '¡Bienvenido de nuevo! Por favor, ingresa tus datos',
        'actions' => [
            'forgot_password' => [
                'label' => '¿Olvidaste tu contraseña?',
            ],
            'submit' => [
                'label' => 'Iniciar sesión',
            ],
        ],
    ],
    'register' => [
        'title' => 'Crear una nueva cuenta',
        'description' => 'Crea una cuenta para comenzar a rastrear tus gastos',
        'terms' => [
            'label' => 'Estoy de acuerdo con los&nbsp;',
            'link' => [
                'label' => 'Términos de Servicio',
            ],
            'and' => '&nbsp;y&nbsp;',
            'link2' => [
                'label' => 'Política de Privacidad',
            ],
        ],
        'actions' => [
            'submit' => [
                'label' => 'Comenzar',
            ],
        ],
    ],
    'reset_password' => [
        'title' => 'Restablecer la contraseña',
        'description' => 'Ingresa tu nueva contraseña y confírmala.',
        'actions' => [
            'submit' => [
                'label' => 'Restablecer contraseña',
            ],
        ],
    ],
    'two_factor_challenge' => [
        'title' => 'Confirmación de Dos Factores',
        'description' => [
            'recovery' => 'Por favor, confirma el acceso a tu cuenta ingresando uno de tus códigos de recuperación de emergencia.',
            'code' => 'Por favor, confirma el acceso a tu cuenta ingresando el código de autenticación proporcionado por tu aplicación de autenticación.',
        ],
        'actions' => [
            'login' => [
                'recovery' => 'Usar un código de autenticación',
                'code' => 'Usar un código de recuperación',
            ],
            'submit' => [
                'label' => 'Iniciar sesión',
            ],
        ],
    ],
    'verify_email' => [
        'description' => 'Antes de continuar, ¿podrías verificar tu dirección de correo electrónico haciendo clic en el enlace que acabamos de enviarte por correo? Si no recibiste el correo, con gusto te enviaremos otro.',
        'actions' => [
            'submit' => [
                'label' => 'Reenviar correo de verificación',
            ],
            'logout' => [
                'label' => 'Cerrar sesión',
            ],
        ],
    ],
];
