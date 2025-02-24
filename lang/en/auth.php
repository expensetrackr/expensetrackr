<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user. You are free to modify
    | these language lines according to your application's requirements.
    |
    */

    'failed' => 'These credentials do not match our records.',
    'password' => 'The provided password is incorrect.',
    'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',

    'actions' => [
        'dont_have_account' => 'Don\'t have an account?',
        'register' => 'Register',
        'already_have_account' => 'Already have an account?',
        'login' => 'Login',
        'changed_mind' => 'Changed your mind?',
    ],

    'confirm_password' => [
        'description' => 'This is a secure area of the application. Please confirm your password before continuing.',
        'actions' => [
            'submit' => [
                'label' => 'Confirm',
            ],
        ],
    ],

    'forgot_password' => [
        'title' => 'Forgot Password',
        'description' => 'Enter your email to reset your password.',
        'actions' => [
            'submit' => [
                'label' => 'Email password reset link',
            ],
        ],
    ],

    'login' => [
        'title' => 'Login to your account',
        'description' => 'Welcome back! Please enter your details',
        'actions' => [
            'forgot_password' => [
                'label' => 'Forgot your password?',
            ],
            'submit' => [
                'label' => 'Log in',
            ],
        ],
    ],

    'register' => [
        'title' => 'Create a new account',
        'description' => 'Create an account to start tracking your expenses',
        'terms' => [
            'label' => 'I agree with the&nbsp;',
            'link' => [
                'label' => 'Terms of Service',
            ],
            'and' => '&nbsp;and&nbsp;',
            'link2' => [
                'label' => 'Privacy Policy',
            ],
        ],
        'actions' => [
            'submit' => [
                'label' => 'Get started',
            ],
        ],
    ],

    'reset_password' => [
        'title' => 'Reset Password',
        'description' => 'Enter your new password and confirm it.',
        'actions' => [
            'submit' => [
                'label' => 'Reset password',
            ],
        ],
    ],

    'two_factor_challenge' => [
        'title' => 'Two-Factor Confirmation',
        'description' => [
            'recovery' => 'Please confirm access to your account by entering one of your emergency recovery codes.',
            'code' => 'Please confirm access to your account by entering the authentication code provided by your authenticator application.',
        ],
        'actions' => [
            'login' => [
                'recovery' => 'Use an authentication code',
                'code' => 'Use a recovery code',
            ],
            'submit' => [
                'label' => 'Log in',
            ],
        ],
    ],

    'verify_email' => [
        'description' => 'Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.',
        'actions' => [
            'submit' => [
                'label' => 'Resend verification email',
            ],
            'logout' => [
                'label' => 'Log Out',
            ],
        ],
    ],
];
