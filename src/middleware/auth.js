/** @format */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userService = require('../services/userService');

/**
 * Initialize Google OAuth2.0 authentication
 * @param {Object} app - Express application
 */
const initializeAuth = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    try {
      const user = userService.getUserById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          const userData = {
            id: profile.id,
            email: profile.emails[0]?.value,
            name: profile.displayName,
            picture: profile.photos[0]?.value,
          };

          const user = userService.saveUser(userData);
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  app.use(
    require('express-session')({
      secret: process.env.SESSION_SECRET || 'voting-app-secret',
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/login', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Login - Voting Application</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .login-box {
              background: white;
              padding: 40px;
              border-radius: 5px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              text-align: center;
            }
            .login-button {
              background-color: #4285F4;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="login-box">
            <h1>Voting Application</h1>
            <p>Please login to continue</p>
            <a href="/auth/google" class="login-button">Login with Google</a>
          </div>
        </body>
      </html>
    `);
  });

  app.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/login');
    });
  });
};

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = {
  initializeAuth,
  isAuthenticated,
};
