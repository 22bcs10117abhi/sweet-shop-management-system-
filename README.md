# 🛒 Gourmet Marketplace Management System

A comprehensive full-stack application for managing a gourmet marketplace/sweet shop, including product inventory, customer management, order processing, and administrative controls.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Default Credentials](#-default-credentials)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Features Overview](#-features-overview)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### Admin Features
- 🔐 Secure admin authentication (username/password)
- 📦 Product management with categories
- 📊 Inventory management with low stock alerts
- 👥 Customer management
- 🛒 Order processing and tracking
- 📈 Dashboard with statistics
- 🔍 Search and filter capabilities

### Customer Features
- 👤 Customer registration (public endpoint)
- 🛍️ Browse products
- 📝 Place orders
- 📋 View order history
- 📱 Responsive design

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Testing:** Jest with Supertest

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios
- **Testing:** Vitest with Testing Library

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (running locally or MongoDB Atlas connection) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning)

## 🚀 Installation

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd "sweet shop"

# Or simply navigate to the project directory
cd "sweet shop"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Navigate to the `backend` directory
2. Create a `.env` file (you can copy from `env.example`):

```bash
cp env.example .env
```

3. Edit the `.env` file with your configuration:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
DB_NAME=gourmet_marketplace
TOKEN_SECRET=your-secret-key-change-this-in-production
TOKEN_EXPIRY=7d
ORIGIN1=http://localhost:5173
```

**Important:** 
- Change `TOKEN_SECRET` to a secure random string in production
- Update `MONGODB_URI` if using MongoDB Atlas or a different MongoDB instance
- Update `ORIGIN1` to match your frontend URL

### Frontend Configuration

The frontend is configured to connect to `http://localhost:8000` by default. If your backend runs on a different port, update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1'
```

## 🏃 Running the Application

### Step 1: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service, it should start automatically)
# Or start manually:
mongod

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Step 2: Create Admin User

Before running the application, create the default admin user:

```bash
cd backend
node src/scripts/createAdmin.js
```

This will create an admin user with:
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change the password after first login!

### Step 3: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:8000`

### Step 4: Start Frontend Server

Open another terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### Step 5: Access the Application

- **Frontend:** Open your browser and navigate to `http://localhost:5173`
- **Backend API:** Available at `http://localhost:8000/api/v1`

## 🔑 Default Credentials

### Admin Login
- **URL:** `http://localhost:5173/admin/login` or `http://localhost:5173/login`
- **Username:** `admin`
- **Password:** `admin123`

### Customer Registration
- **URL:** `http://localhost:5173/customer/login`
- Click on "Register" tab
- Fill in the registration form (Name and Phone are required)

## 📁 Project Structure

```
sweet shop/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & error handling
│   │   ├── utils/           # Helper functions
│   │   ├── scripts/         # Setup scripts (createAdmin.js)
│   │   ├── db/              # Database connection
│   │   ├── app.js           # Express app configuration
│   │   └── index.js         # Server entry point
│   ├── tests/               # Test files
│   ├── package.json
│   └── .env                 # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages/components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md                # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/users/admin/login` - Admin login
- `POST /api/v1/users/logout` - Logout

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Protected)
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category (Protected)
- `DELETE /api/v1/categories/:id` - Delete category (Protected)

### Products
- `GET /api/v1/products` - Get all products (with pagination, search, filter)
- `POST /api/v1/products` - Create product (Protected)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product (Protected)
- `DELETE /api/v1/products/:id` - Delete product (Protected)
- `GET /api/v1/products/low-stock` - Get low stock products (Protected)

### Customers
- `POST /api/v1/customers/register` - **Public customer registration**
- `GET /api/v1/customers` - Get all customers (Protected)
- `POST /api/v1/customers` - Create customer (Protected)
- `GET /api/v1/customers/:id` - Get customer by ID (Protected)
- `PUT /api/v1/customers/:id` - Update customer (Protected)
- `DELETE /api/v1/customers/:id` - Delete customer (Protected)

### Orders
- `GET /api/v1/orders` - Get all orders (Protected)
- `POST /api/v1/orders` - Create order (Protected)
- `POST /api/v1/orders/customer` - Create customer order (Public)
- `GET /api/v1/orders/customer?phone=xxx` - Get customer orders (Public)
- `GET /api/v1/orders/:id` - Get order by ID (Protected)
- `PUT /api/v1/orders/:id` - Update order (Protected)
- `GET /api/v1/orders/stats` - Get order statistics (Protected)

### Inventory
- `GET /api/v1/inventory` - Get all inventory (Protected)
- `GET /api/v1/inventory/low-stock` - Get low stock items (Protected)
- `GET /api/v1/inventory/product/:productId` - Get inventory by product (Protected)
- `PUT /api/v1/inventory/product/:productId` - Update inventory (Protected)
- `POST /api/v1/inventory/product/:productId/restock` - Restock inventory (Protected)

**Note:** Protected routes require a valid JWT token in the Authorization header or cookie.

## 📊 Features Overview

### Product Management
- Create, update, and delete products
- Organize products by categories
- Track stock levels and set minimum stock alerts
- Upload product images
- Barcode support

### Inventory Management
- Real-time inventory tracking
- Automatic stock updates on order creation/cancellation
- Low stock alerts
- Restock functionality
- Reserved quantity tracking

### Order Management
- Create orders with multiple items
- Track order status (pending, confirmed, preparing, ready, completed, cancelled)
- Payment method tracking (cash, card, UPI, online)
- Order statistics and reporting
- Customer order history

### Customer Management
- Customer registration (public endpoint)
- Customer profile management
- Order history tracking
- Total orders and spending statistics

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:verbose  # Run tests with verbose output
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🔧 Troubleshooting

### Backend Issues

**Problem:** `nodemon is not recognized`
```bash
# Solution: Install nodemon globally or use npx
npm install -g nodemon
# OR
npx nodemon src/index.js
```

**Problem:** MongoDB connection error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is accessible on the specified port

**Problem:** Port 8000 already in use
- Change `PORT` in `.env` file
- Or stop the process using port 8000

### Frontend Issues

**Problem:** Cannot connect to backend
- Ensure backend server is running
- Check `API_BASE_URL` in `frontend/src/services/api.js`
- Verify CORS settings in backend

**Problem:** Admin login not working
- Ensure admin user exists (run `node src/scripts/createAdmin.js`)
- Check browser console for errors
- Verify backend is running and accessible

### General Issues

**Problem:** Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Environment variables not loading
- Ensure `.env` file exists in `backend` directory
- Check for typos in variable names
- Restart the server after changing `.env`

## 📝 Notes

- All protected routes require authentication token (JWT)
- Token can be sent via cookie or Authorization header: `Bearer <token>`
- Inventory is automatically updated when orders are created/cancelled
- Product stock is synchronized with inventory
- Customer registration is public (no authentication required)
- Admin routes require admin authentication

## 🔒 Security Considerations

- Change default admin password after first login
- Use a strong `TOKEN_SECRET` in production
- Enable HTTPS in production
- Validate and sanitize all user inputs
- Use environment variables for sensitive data
- Regularly update dependencies

## 📄 License

ISC

## 👥 Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

---

**Happy Coding! 🎉**

#   s w e e t - s h o p - m a n a g e m e n t - s y s t e m - 
 
 
