# PR: Add Google OAuth 2.0 Authentication with Role-Based Access Control

## Overview

This PR implements secure authentication using Google OAuth 2.0 with role-based access control for the Schedula API. Users can now authenticate via Google and are assigned roles (doctor or patient) that are stored in the database and included in JWT tokens for authorization.

## Key Features

### 🔐 Google OAuth 2.0 Integration

- Integrated Google OAuth 2.0 strategy with NestJS Passport
- Secure authentication flow with Google's consent screen
- Automatic user profile extraction (email, name, profile picture)

### 👤 Enhanced User Entity

- Updated User entity with new fields:
  - `provider`: Defaults to 'google' for OAuth users
  - `password`: Now nullable for OAuth users
  - `role`: Enum field for 'doctor' or 'patient' roles

### 🛡️ JWT Authentication

- JWT token generation with user information
- Token includes user ID, email, role, and name
- 24-hour token expiration
- JWT strategy for protecting routes

### 🔗 API Endpoints

#### `GET /api/v1/auth/google?role=doctor|patient`

- Initiates Google OAuth flow
- Role parameter determines user role in the system
- Redirects to Google's consent screen

#### `GET /api/v1/auth/google/callback`

- Handles OAuth callback from Google
- Extracts Google profile information
- Creates new user or finds existing user
- Generates JWT token with user information
- Returns JWT token and user details

### 📊 Database Changes

- Added migration for User entity updates
- `provider` field with default value 'google'
- `password` field made nullable for OAuth users

## Technical Implementation

### Dependencies Added

- `@nestjs/passport` - Passport integration for NestJS
- `@nestjs/jwt` - JWT token handling
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `passport-jwt` - JWT strategy
- `express-session` - Session management for role storage

### Files Created/Modified

#### New Files:

- `src/auth/auth.service.ts` - Authentication business logic
- `src/auth/auth.controller.ts` - OAuth endpoints
- `src/auth/auth.module.ts` - Auth module configuration
- `src/auth/google.strategy.ts` - Google OAuth strategy
- `src/auth/jwt.strategy.ts` - JWT validation strategy
- `src/auth/jwt-auth.guard.ts` - JWT protection guard
- `src/migrations/1757481000000-AddProviderFieldToUser.ts` - Database migration
- `AUTHENTICATION_SETUP.md` - Setup documentation

#### Modified Files:

- `src/entities/user.entity.ts` - Added provider field, made password nullable
- `src/app.module.ts` - Added AuthModule import
- `src/main.ts` - Added session middleware configuration
- `package.json` - Added new dependencies

## Authentication Flow

1. **User initiates login**: `GET /api/v1/auth/google?role=doctor`
2. **Role stored in session**: Role parameter saved for later use
3. **Google OAuth redirect**: User redirected to Google consent screen
4. **Google callback**: `GET /api/v1/auth/google/callback`
5. **User processing**:
   - Extract Google profile (email, name)
   - Find existing user or create new user with specified role
   - Generate JWT token with user information
6. **Response**: Return JWT token and user details

## Response Format

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

## Security Features

- JWT tokens with 24-hour expiration
- Role-based access control
- Secure session management
- Environment variable configuration for secrets
- OAuth 2.0 standard compliance

## Setup Requirements

1. **Environment Variables** (see `AUTHENTICATION_SETUP.md`):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `JWT_SECRET`
   - `SESSION_SECRET`

2. **Google Cloud Console Setup**:
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI: `http://localhost:3000/api/v1/auth/google/callback`

3. **Database Migration**:
   ```bash
   npm run typeorm migration:run -d src/data-source.ts
   ```

## Testing

The authentication can be tested by:

1. Starting the server: `npm run start:dev`
2. Visiting: `http://localhost:3000/api/v1/auth/google?role=doctor`
3. Completing Google OAuth flow
4. Receiving JWT token and user information

## Future Enhancements

- Refresh token implementation
- Role-based route protection
- User profile management endpoints
- Logout functionality
- Multi-provider OAuth support

## Breaking Changes

- User entity schema updated (requires migration)
- New dependencies added to package.json
- Session middleware added to main.ts

## Dependencies

All new dependencies are production-ready and widely used in the NestJS ecosystem.
