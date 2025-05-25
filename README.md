<!-- @format -->

# Voting Application

A Node.js polling application with Google OAuth 2.0 authentication.

## Features

- Google OAuth 2.0 authentication
- Create, read, update, and delete polls
- Add options to polls
- Vote on poll options
- View poll results
- User-specific permissions (only creators can edit their polls)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Cloud Platform account for OAuth credentials

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory based on the `.env.example` file:

   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your Google OAuth credentials (see below for instructions).

5. Start the server:
   ```
   npm start
   ```

## Setting up Google OAuth 2.0

### Create OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "Credentials".
4. Click "Create Credentials" and select "OAuth client ID".
5. Set the application type to "Web application".
6. Add a name for your OAuth client.
7. Add authorized JavaScript origins:
   - For development: `http://localhost:3000`
   - For production: Your production domain
8. Add authorized redirect URIs:
   - For development: `http://localhost:3000/auth/google/callback`
   - For production: `https://your-domain.com/auth/google/callback`
9. Click "Create" to create your OAuth client ID.
10. Copy your Client ID and Client Secret.

### Configure Your Application

1. Open your `.env` file and add the following:

   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   SESSION_SECRET=a_secure_random_string
   ```

2. Replace `your_client_id_here` and `your_client_secret_here` with the values from the Google Cloud Console.
3. Change the `GOOGLE_CALLBACK_URL` if you're deploying to production.
4. Set `SESSION_SECRET` to a secure random string to encrypt your sessions.

### Enable the Google+ API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library".
2. Search for "Google+ API" and enable it for your project.

## API Endpoints

### Public Endpoints (No authentication required)

- `GET /polls` - Get all polls
- `GET /polls/:id` - Get a poll by ID
- `GET /polls/:id/results` - Get poll results

### Protected Endpoints (Requires Google authentication)

#### Polls

- `POST /polls` - Create a new poll
- `PUT /polls/:id` - Update a poll
- `DELETE /polls/:id` - Delete a poll

#### Options

- `POST /options` - Create a new option
- `GET /options` - Get all options
- `GET /options/:id` - Get an option by ID
- `PUT /options/:id` - Update an option
- `DELETE /options/:id` - Delete an option

#### Votes

- `POST /votes` - Create a new vote
- `GET /votes` - Get all votes
- `GET /votes/:id` - Get a vote by ID
- `PUT /votes/:id` - Update a vote
- `DELETE /votes/:id` - Delete a vote

## Database Structure

The application uses SQLite with the following tables:

- `users` - Stores user information from Google OAuth
- `polls` - Stores information about polls
- `options` - Stores poll options
- `votes` - Stores votes cast by users

## Running Tests

```
npm test
```

## License

ISC

## Database

We decided to choose SQLite because of it's convinience & simplicity, because MongoDB or MySQL are overpowered for us.
