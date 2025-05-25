/** @format */
const express = require('express');
const path = require('path');
const fs = require('fs');

class HomeController {
  /**
   * Render the home page
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  getHomePage(req, res) {
    const user = req.user;
    const isAuthenticated = req.isAuthenticated();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Voting Application</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .user-profile {
            display: flex;
            align-items: center;
          }
          .user-profile img {
            border-radius: 50%;
            margin-right: 10px;
          }
          .auth-buttons a {
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin-left: 10px;
          }
          .login-btn {
            background-color: #4285F4;
            color: white;
          }
          .logout-btn {
            background-color: #f1f1f1;
            color: #333;
          }
          .welcome-section {
            margin: 40px 0;
            text-align: center;
          }
          .welcome-section h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
          }
          .api-section {
            margin-top: 50px;
          }
          .api-section h2 {
            margin-bottom: 20px;
          }
          .endpoint {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 4px;
            border-left: 4px solid #4285F4;
          }
          .endpoint h3 {
            margin-top: 0;
          }
          .public {
            border-left-color: #34A853;
          }
          .protected {
            border-left-color: #FBBC05;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div>
              <h1>Voting Application</h1>
            </div>
            <div>
              ${
                isAuthenticated
                  ? `
                <div class="user-profile">
                  <img src="${user.picture}" alt="Profile" width="40" height="40">
                  <div>
                    <div><strong>${user.name}</strong></div>
                    <div><small>${user.email}</small></div>
                  </div>
                  <a href="/logout" class="auth-buttons logout-btn">Logout</a>
                </div>
              `
                  : `
                <div class="auth-buttons">
                  <a href="/login" class="login-btn">Login with Google</a>
                </div>
              `
              }
            </div>
          </header>

          <div class="welcome-section">
            <h1>Welcome to the Voting Application</h1>
            <p>This application allows users to create polls, vote, and view results.</p>
            ${
              isAuthenticated
                ? `
              <p>You are signed in as <strong>${user.name}</strong>.</p>
            `
                : `
              <p>Please <a href="/login">sign in</a> to create polls and vote.</p>
            `
            }
          </div>

          <div class="api-section">
            <h2>API Endpoints</h2>
            
            <div class="endpoint public">
              <h3>Public Endpoints</h3>
              <p>These endpoints don't require authentication:</p>
              <ul>
                <li><code>GET /polls</code> - Get all polls</li>
                <li><code>GET /polls/:id</code> - Get a poll by ID</li>
                <li><code>GET /polls/:id/results</code> - Get poll results</li>
              </ul>
            </div>
            
            <div class="endpoint protected">
              <h3>Protected Endpoints</h3>
              <p>These endpoints require Google authentication:</p>
              <ul>
                <li><code>POST /polls</code> - Create a new poll</li>
                <li><code>PUT /polls/:id</code> - Update a poll</li>
                <li><code>DELETE /polls/:id</code> - Delete a poll</li>
                <li><code>POST /options</code> - Create a new option</li>
                <li><code>GET /options</code> - Get all options</li>
                <li><code>GET /options/:id</code> - Get an option by ID</li>
                <li><code>PUT /options/:id</code> - Update an option</li>
                <li><code>DELETE /options/:id</code> - Delete an option</li>
                <li><code>POST /votes</code> - Create a new vote</li>
                <li><code>GET /votes</code> - Get all votes</li>
                <li><code>GET /votes/:id</code> - Get a vote by ID</li>
                <li><code>PUT /votes/:id</code> - Update a vote</li>
                <li><code>DELETE /votes/:id</code> - Delete a vote</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(html);
  }
}

module.exports = new HomeController();
