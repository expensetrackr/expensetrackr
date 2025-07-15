# API Documentation

This directory contains comprehensive API documentation for all ExpenseTrackr endpoints.

## 📋 Available APIs

### 🏦 [Account API](./accounts-api.md)
Complete CRUD operations for financial account management.

**Features:**
- Create, read, update, and delete accounts
- Support for multiple account types (depository, credit card, loan, etc.)
- Currency conversion and multi-currency support
- Comprehensive validation and error handling
- Performance optimizations with pagination and filtering

**Endpoints:**
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts/{id}` - Get specific account
- `PUT/PATCH /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

## 🔐 Authentication

All API endpoints require authentication using Laravel Sanctum:

```http
Authorization: Bearer {your_token}
```

To obtain a token, use the authentication endpoints:
- `POST /api/auth/login` - Login and receive token
- `POST /api/auth/register` - Register new user and receive token

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* validation errors if applicable */ }
}
```

## 🚀 Getting Started

1. **Obtain API Token**: Use the auth endpoints to get your access token
2. **Make Requests**: Include the token in the Authorization header
3. **Handle Responses**: Parse the consistent JSON response format
4. **Error Handling**: Implement proper error handling for all status codes

## 📝 Future APIs

More API documentation will be added as new endpoints are developed:

- **Categories API** - Manage expense categories
- **Transactions API** - Handle financial transactions
- **Reports API** - Generate financial reports
- **Bank Connections API** - Manage bank integrations

## 🔗 Related Documentation

- [Development Guide](../development/) - For developers working on the API
- [Project README](../../README.md) - General project information

## 📞 Support

For API support or questions:
1. Check the specific endpoint documentation
2. Review the error response format
3. Consult the development documentation
4. Refer to the main project documentation

---

*Last updated: January 2024*