# URL Shortener Microservice

A full-stack URL shortener with Node.js/Express backend and React frontend.

## Features

- **Shorten URLs** with custom or auto-generated codes
- **30-minute default expiry** (customizable)
- **Click analytics** with timestamps and referrer data
- **Custom logging** integrated with evaluation service
- **React frontend** for easy management

## Tech Stack

**Backend:** Node.js, Express, Custom Logging Middleware  
**Frontend:** React, Axios  
**Storage:** In-memory (Map)  
**Logging:** Custom middleware with external API integration

## API Endpoints

- `POST /shorturls` - Create short URL
- `GET /:shortcode` - Redirect to original URL  
- `GET /shorturls/:shortcode/stats` - Get analytics

## Quick Start

```bash
# Backend (port 8000)
cd BackendTestSubmission
npm install
npm run dev

# Frontend (port 3000)  
cd FrontendTestSubmission
npm install
npm start
