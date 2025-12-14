# Gourmet Marketplace Management System - Frontend

A modern React.js frontend for the Gourmet Marketplace Management System.

## Features

- 🎨 Beautiful and modern UI with gradient backgrounds
- 📊 Dashboard with statistics and recent orders
- 📁 Category management (CRUD operations)
- 🍬 Product management with search and filtering
- 👥 Customer management
- 🛒 Order creation and management
- 📦 Inventory management with low stock alerts
- 🔐 Authentication system
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 8000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx   # Main layout with sidebar
│   │   └── PrivateRoute.jsx
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Categories.jsx
│   │   ├── Products.jsx
│   │   ├── Customers.jsx
│   │   ├── Orders.jsx
│   │   └── Inventory.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
└── vite.config.js
```

## API Integration

The frontend is configured to connect to the backend API at `http://localhost:8000/api/v1`.

All API calls are handled through the `api.js` service file which includes:
- Automatic token injection
- Error handling
- Request/response interceptors

## Authentication

The app uses JWT tokens stored in localStorage. For demo purposes, the login uses a simplified token generation. In production, you would integrate with Web3 wallet authentication.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Overview

### Dashboard
- View total revenue, orders, products, customers
- Low stock alerts
- Recent orders list

### Categories
- Create, read, update, delete categories
- Active/inactive status management

### Products
- Full CRUD operations
- Search functionality
- Category filtering
- Low stock indicators
- Price and stock management

### Customers
- Customer management
- Order history tracking
- Total spent tracking
- Address management

### Orders
- Create new orders
- View order details
- Order status management
- Cancel orders
- Payment method selection

### Inventory
- View all inventory items
- Stock status indicators
- Restock functionality
- Low stock alerts

## Styling

The application uses:
- Custom CSS with CSS variables for theming
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations and transitions
- Responsive grid layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Make sure the backend server is running before starting the frontend
- The backend should be configured to allow CORS from `http://localhost:3000`
- Authentication tokens are stored in localStorage

