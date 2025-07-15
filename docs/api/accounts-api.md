# Accounts API Documentation

This document provides comprehensive information about the Account CRUD API endpoints implemented for the ExpenseTrackr application.

## Overview

The Accounts API provides full CRUD (Create, Read, Update, Delete) operations for managing financial accounts. The API follows RESTful principles and includes proper validation, authorization, and error handling.

## Base URL

- **Internal API**: `/api/accounts`
- **External API**: `/api/accounts` (requires authentication)

## Authentication

External API endpoints require authentication using Laravel Sanctum:

```http
Authorization: Bearer {token}
```

## Common Response Format

All API responses follow a consistent format:

### Success Response

```json
{
    "success": true,
    "message": "Success message",
    "data": {
        /* resource data */
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Error message",
    "errors": {
        /* validation errors if applicable */
    }
}
```

## Endpoints

### 1. List Accounts

**GET** `/api/accounts`

Retrieve a paginated list of accounts for the current workspace.

#### Query Parameters

| Parameter               | Type    | Description                                                                                      | Default       |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------ | ------------- |
| `per_page`              | integer | Items per page (max 100)                                                                         | 15            |
| `page`                  | integer | Page number                                                                                      | 1             |
| `filter[name]`          | string  | Filter by account name                                                                           | -             |
| `filter[currency_code]` | string  | Filter by currency code                                                                          | -             |
| `filter[is_default]`    | boolean | Filter by default status                                                                         | -             |
| `filter[is_manual]`     | boolean | Filter by manual status                                                                          | -             |
| `sort`                  | string  | Sort field (`name`, `-name`, `created_at`, `-created_at`, `current_balance`, `-current_balance`) | `-created_at` |
| `include`               | string  | Include relationships (`bankConnection`, `accountable`)                                          | -             |

#### Example Request

```http
GET /api/accounts?per_page=20&filter[name]=savings&sort=-current_balance&include=bankConnection,accountable
```

#### Example Response

```json
{
    "data": [
        {
            "id": "acc_123456",
            "name": "Primary Savings",
            "description": "Main savings account",
            "type": "depository",
            "subtype": "savings",
            "currencyCode": "USD",
            "baseCurrency": null,
            "currencyRate": null,
            "initialBalance": "1000.00",
            "baseInitialBalance": null,
            "currentBalance": "1500.00",
            "baseCurrentBalance": null,
            "isDefault": true,
            "isManual": true,
            "externalId": null,
            "createdAt": "2024-01-15T10:30:00Z",
            "updatedAt": "2024-01-15T10:30:00Z",
            "connection": null,
            "accountable": {},
            "permissions": {
                "canView": true,
                "canUpdate": true,
                "canDelete": true
            }
        }
    ],
    "links": {
        /* pagination links */
    },
    "meta": {
        /* pagination metadata */
    }
}
```

### 2. Create Account

**POST** `/api/accounts`

Create a new account in the current workspace.

#### Request Body

| Field                | Type    | Required | Description                         |
| -------------------- | ------- | -------- | ----------------------------------- |
| `name`               | string  | Yes      | Account name (max 255 chars)        |
| `description`        | string  | No       | Account description (max 500 chars) |
| `currency_code`      | string  | Yes      | 3-letter currency code              |
| `initial_balance`    | number  | Yes      | Initial balance (min 0.01)          |
| `type`               | string  | Yes      | Account type (see Account Types)    |
| `subtype`            | string  | No       | Account subtype                     |
| `is_default`         | boolean | No       | Set as default account              |
| `bank_connection_id` | integer | No       | Associated bank connection ID       |
| `external_id`        | string  | No       | External system ID                  |

#### Credit Card Specific Fields (required if type = "credit_card")

| Field              | Type   | Required | Description            |
| ------------------ | ------ | -------- | ---------------------- |
| `available_credit` | number | Yes      | Available credit limit |
| `minimum_payment`  | number | Yes      | Minimum payment amount |
| `apr`              | number | Yes      | Annual percentage rate |
| `annual_fee`       | number | Yes      | Annual fee amount      |
| `expires_at`       | date   | Yes      | Card expiration date   |

#### Loan Specific Fields (required if type = "loan")

| Field           | Type    | Required | Description                 |
| --------------- | ------- | -------- | --------------------------- |
| `interest_rate` | number  | Yes      | Interest rate percentage    |
| `rate_type`     | string  | Yes      | Rate type (fixed, variable) |
| `term_months`   | integer | Yes      | Loan term in months         |

#### Example Request

```json
{
    "name": "Primary Checking",
    "description": "Main checking account",
    "currency_code": "USD",
    "initial_balance": 5000.0,
    "type": "depository",
    "subtype": "checking",
    "is_default": true
}
```

#### Example Response

```json
{
    "success": true,
    "message": "Account created successfully",
    "data": {
        "id": "acc_789012",
        "name": "Primary Checking",
        "description": "Main checking account",
        "type": "depository",
        "subtype": "checking",
        "currencyCode": "USD",
        "baseCurrency": null,
        "currencyRate": null,
        "initialBalance": "5000.00",
        "baseInitialBalance": null,
        "currentBalance": "5000.00",
        "baseCurrentBalance": null,
        "isDefault": true,
        "isManual": true,
        "externalId": null,
        "createdAt": "2024-01-15T11:30:00Z",
        "updatedAt": "2024-01-15T11:30:00Z",
        "connection": null,
        "accountable": {},
        "permissions": {
            "canView": true,
            "canUpdate": true,
            "canDelete": true
        }
    }
}
```

### 3. Get Account

**GET** `/api/accounts/{account}`

Retrieve a specific account by its public ID.

#### Path Parameters

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `account` | string | Account public ID |

#### Query Parameters

| Parameter | Type   | Description                                                             |
| --------- | ------ | ----------------------------------------------------------------------- |
| `include` | string | Include relationships (`bankConnection`, `accountable`, `transactions`) |

#### Example Request

```http
GET /api/accounts/acc_123456?include=bankConnection,accountable,transactions
```

#### Example Response

```json
{
    "id": "acc_123456",
    "name": "Primary Savings",
    "description": "Main savings account",
    "type": "depository",
    "subtype": "savings",
    "currencyCode": "USD",
    "baseCurrency": null,
    "currencyRate": null,
    "initialBalance": "1000.00",
    "baseInitialBalance": null,
    "currentBalance": "1500.00",
    "baseCurrentBalance": null,
    "isDefault": true,
    "isManual": true,
    "externalId": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "connection": null,
    "accountable": {},
    "transactions": [
        {
            "id": "txn_123",
            "name": "Deposit",
            "amount": "500.00",
            "type": "income",
            "datedAt": "2024-01-15T09:00:00Z",
            "category": {
                "id": "cat_123",
                "name": "Transfer"
            }
        }
    ],
    "permissions": {
        "canView": true,
        "canUpdate": true,
        "canDelete": true
    }
}
```

### 4. Update Account

**PUT/PATCH** `/api/accounts/{account}`

Update an existing account.

#### Path Parameters

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `account` | string | Account public ID |

#### Request Body

All fields are optional for updates. Only include fields you want to change.

| Field           | Type    | Description                         |
| --------------- | ------- | ----------------------------------- |
| `name`          | string  | Account name (max 255 chars)        |
| `description`   | string  | Account description (max 500 chars) |
| `currency_code` | string  | 3-letter currency code              |
| `is_default`    | boolean | Set as default account              |
| `external_id`   | string  | External system ID                  |
| `subtype`       | string  | Account subtype                     |

#### Type-Specific Fields

Include type-specific fields only if the account type supports them:

**Credit Card Fields:**

- `available_credit` (number)
- `minimum_payment` (number)
- `apr` (number)
- `annual_fee` (number)
- `expires_at` (date)

**Loan Fields:**

- `interest_rate` (number)
- `rate_type` (string)
- `term_months` (integer)

#### Example Request

```json
{
    "name": "Updated Savings Account",
    "description": "Updated description",
    "is_default": false
}
```

#### Example Response

```json
{
    "success": true,
    "message": "Account updated successfully",
    "data": {
        "id": "acc_123456",
        "name": "Updated Savings Account",
        "description": "Updated description",
        "type": "depository",
        "subtype": "savings",
        "currencyCode": "USD",
        "baseCurrency": null,
        "currencyRate": null,
        "initialBalance": "1000.00",
        "baseInitialBalance": null,
        "currentBalance": "1500.00",
        "baseCurrentBalance": null,
        "isDefault": false,
        "isManual": true,
        "externalId": null,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T12:00:00Z",
        "connection": null,
        "accountable": {},
        "permissions": {
            "canView": true,
            "canUpdate": true,
            "canDelete": true
        }
    }
}
```

### 5. Delete Account

**DELETE** `/api/accounts/{account}`

Delete an existing account.

#### Path Parameters

| Parameter | Type   | Description       |
| --------- | ------ | ----------------- |
| `account` | string | Account public ID |

#### Example Request

```http
DELETE /api/accounts/acc_123456
```

#### Example Response

```json
{
    "success": true,
    "message": "Account deleted successfully",
    "data": null
}
```

## Account Types

The following account types are supported:

| Type              | Description                       | Specific Fields                                                |
| ----------------- | --------------------------------- | -------------------------------------------------------------- |
| `depository`      | Bank accounts (checking, savings) | -                                                              |
| `investment`      | Investment accounts               | -                                                              |
| `crypto`          | Cryptocurrency accounts           | -                                                              |
| `other_asset`     | Other asset accounts              | -                                                              |
| `credit_card`     | Credit card accounts              | available_credit, minimum_payment, apr, annual_fee, expires_at |
| `loan`            | Loan accounts                     | interest_rate, rate_type, term_months                          |
| `other_liability` | Other liability accounts          | -                                                              |

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages:

### Validation Errors (422)

```json
{
    "success": false,
    "message": "The given data was invalid.",
    "errors": {
        "name": ["The name field is required."],
        "currency_code": ["The currency code field is required."]
    }
}
```

### Authorization Errors (403)

```json
{
    "success": false,
    "message": "You are not authorized to perform this action."
}
```

### Not Found Errors (404)

```json
{
    "success": false,
    "message": "Resource not found."
}
```

### Business Logic Errors (422)

```json
{
    "success": false,
    "message": "Cannot delete account with existing transactions. Please delete or reassign all transactions first."
}
```

## Rate Limiting

API endpoints are subject to rate limiting to prevent abuse. The limits are:

- **Authenticated requests**: 60 requests per minute
- **Unauthenticated requests**: 20 requests per minute

Rate limit information is included in response headers:

- `X-RateLimit-Limit`: The maximum number of requests allowed
- `X-RateLimit-Remaining`: The number of requests remaining in the current window
- `X-RateLimit-Reset`: The Unix timestamp when the rate limit window resets

When rate limit is exceeded, a 429 status code is returned with a `Retry-After` header indicating when to retry.

## Performance Optimizations

1. **Pagination**: All listing endpoints are paginated with a maximum of 100 items per page
2. **Selective Loading**: Use the `include` parameter to only load required relationships
3. **Filtering**: Use query filters to reduce dataset size
4. **Caching**: Exchange rates are cached to improve performance
5. **Database Optimization**: Queries are optimized with proper indexes and eager loading

## Best Practices

1. **Use Pagination**: Always use pagination for list endpoints
2. **Include Only Needed Data**: Use the `include` parameter selectively
3. **Handle Errors Gracefully**: Implement proper error handling for all status codes
4. **Validate Input**: Client-side validation should mirror server-side rules
5. **Use Appropriate HTTP Methods**: Follow RESTful conventions
6. **Monitor Rate Limits**: Implement rate limit handling in your client

## Examples

### Create a Credit Card Account

```json
POST /api/accounts
{
  "name": "Visa Credit Card",
  "description": "Primary credit card",
  "currency_code": "USD",
  "initial_balance": 0,
  "type": "credit_card",
  "available_credit": 5000,
  "minimum_payment": 25,
  "apr": 18.99,
  "annual_fee": 95,
  "expires_at": "2026-12-31"
}
```

### Create a Loan Account

```json
POST /api/accounts
{
  "name": "Home Mortgage",
  "description": "Primary residence mortgage",
  "currency_code": "USD",
  "initial_balance": 250000,
  "type": "loan",
  "interest_rate": 3.5,
  "rate_type": "fixed",
  "term_months": 360
}
```

### Filter and Sort Accounts

```http
GET /api/accounts?filter[currency_code]=USD&filter[is_default]=true&sort=-current_balance&include=bankConnection
```

This API provides a comprehensive solution for managing financial accounts with proper validation, authorization, and error handling following Laravel best practices and DRY principles.
