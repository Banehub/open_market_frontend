# OpenMarket

A modern marketplace application built with React, Vite, and CSS Modules.

## Features

- 🏪 Browse and search listings
- 👤 User profiles and verified sellers
- ⭐ Rating system
- 📱 Responsive design
- 🎨 Smooth, modern UI

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
# or
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API / Backend

The frontend is fully API-driven. Use the **`api-spec.json`** in the project root to build a MongoDB-backed API (e.g. with Node/Express). Payment is out of scope in the spec.

1. Copy `.env.example` to `.env` and set your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
2. All data (users, listings, ratings) is loaded from the API. No mock data.

## Project Structure

```
src/
  ├── api/            # API client (auth, users, listings, ratings)
  ├── components/     # Reusable components
  ├── context/        # Auth context
  ├── pages/          # Page components
  ├── router/         # Routing configuration
  ├── App.jsx         # Main app component
  ├── main.jsx        # Entry point
  └── index.css       # Global styles
```

## Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/marketplace` - Browse all listings
- `/listing/:id` - Listing details
- `/store/:username` - Seller store page
- `/profile` - User profile
- `/create-listing` - Create new listing
- `/settings` - User settings

## Tech Stack

- React 18
- Vite
- React Router DOM
- CSS Modules

