# Google OAuth 2.0 Authentication Setup

This document explains how to set up Google OAuth 2.0 authentication for the Schedula API.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=schedula_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# Server Configuration
PORT=3000
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set the authorized redirect URI to: `http://localhost:3000/api/v1/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## API Endpoints

### Authentication Flow

1. **Initiate Google OAuth**: `GET /api/v1/auth/google?role=doctor|patient`
   - Redirects to Google OAuth consent screen
   - Role parameter determines user role in the system

2. **OAuth Callback**: `GET /api/v1/auth/google/callback`
   - Handled automatically by Google OAuth
   - Returns JWT token and user information

### Response Format

After successful authentication, the callback returns:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "doctor",
    "provider": "google"
  }
}
```

## Database Changes

The User entity has been updated with:

- `provider` field (defaults to 'google')
- `password` field is now nullable (for OAuth users)

Run the migration to update your database:

```bash
npm run typeorm migration:run -d src/data-source.ts
```

## Usage Example

```bash
# Start authentication flow for a doctor
curl "http://localhost:3000/api/v1/auth/google?role=doctor"

# The user will be redirected to Google, then back to the callback
# The callback will return a JWT token that can be used for subsequent requests
```

## Security Notes

- Change the JWT_SECRET and SESSION_SECRET in production
- Use HTTPS in production
- Set secure: true for session cookies in production
- Consider implementing refresh tokens for long-lived sessions
