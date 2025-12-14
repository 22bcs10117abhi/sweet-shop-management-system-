# Gourmet Marketplace Management System - Backend Setup

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
TOKEN_SECRET=your-secret-key-change-this-in-production
TOKEN_EXPIRY=7d
ORIGIN1=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## API Endpoints

### Authentication
- `GET /api/v1/users/nonce` - Get nonce for authentication
- `POST /api/v1/users/verify` - Verify and login
- `POST /api/v1/users/logout` - Logout

### Categories
- `POST /api/v1/categories` - Create category (Protected)
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category (Protected)
- `DELETE /api/v1/categories/:id` - Delete category (Protected)

### Products
- `POST /api/v1/products` - Create product (Protected)
- `GET /api/v1/products` - Get all products (with pagination, search, filter)
- `GET /api/v1/products/low-stock` - Get low stock products (Protected)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product (Protected)
- `DELETE /api/v1/products/:id` - Delete product (Protected)

### Customers
- `POST /api/v1/customers` - Create customer (Protected)
- `GET /api/v1/customers` - Get all customers (Protected)
- `GET /api/v1/customers/:id` - Get customer by ID (Protected)
- `PUT /api/v1/customers/:id` - Update customer (Protected)
- `DELETE /api/v1/customers/:id` - Delete customer (Protected)

### Orders
- `POST /api/v1/orders` - Create order (Protected)
- `GET /api/v1/orders` - Get all orders (Protected)
- `GET /api/v1/orders/stats` - Get order statistics (Protected)
- `GET /api/v1/orders/:id` - Get order by ID (Protected)
- `PUT /api/v1/orders/:id` - Update order (Protected)
- `POST /api/v1/orders/:id/cancel` - Cancel order (Protected)

### Inventory
- `GET /api/v1/inventory` - Get all inventory (Protected)
- `GET /api/v1/inventory/low-stock` - Get low stock items (Protected)
- `GET /api/v1/inventory/product/:productId` - Get inventory by product (Protected)
- `PUT /api/v1/inventory/product/:productId` - Update inventory (Protected)
- `POST /api/v1/inventory/product/:productId/restock` - Restock inventory (Protected)

## Database Models

### Category
- name (String, required, unique)
- description (String)
- isActive (Boolean, default: true)

### Product
- name (String, required)
- description (String)
- category (ObjectId, ref: Category)
- price (Number, required)
- costPrice (Number, required)
- unit (String, enum: ['kg', 'piece', 'dozen', 'pack', 'gram'])
- image (String)
- stock (Number, default: 0)
- minStockLevel (Number, default: 10)
- isActive (Boolean, default: true)
- barcode (String, unique)

### Customer
- name (String, required)
- email (String)
- phone (String, required)
- address (Object)
- totalOrders (Number, default: 0)
- totalSpent (Number, default: 0)
- isActive (Boolean, default: true)

### Order
- orderNumber (String, required, unique, auto-generated)
- customer (ObjectId, ref: Customer)
- items (Array of order items)
- subtotal (Number)
- discount (Number, default: 0)
- tax (Number, default: 0)
- total (Number)
- paymentMethod (String, enum: ['cash', 'card', 'upi', 'online'])
- paymentStatus (String, enum: ['pending', 'paid', 'partial', 'refunded'])
- orderStatus (String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
- notes (String)

### Inventory
- product (ObjectId, ref: Product, unique)
- quantity (Number, default: 0)
- reservedQuantity (Number, default: 0)
- availableQuantity (Number, calculated)
- minStockLevel (Number, default: 10)
- maxStockLevel (Number, default: 1000)
- lastRestocked (Date)
- lastSold (Date)

## Features

- Product management with categories
- Customer management
- Order processing with inventory tracking
- Inventory management with low stock alerts
- Order statistics and reporting
- JWT-based authentication
- RESTful API design
- Error handling middleware
- Input validation

## Notes

- All protected routes require authentication token (JWT)
- Token can be sent via cookie or Authorization header
- Inventory is automatically updated when orders are created/cancelled
- Product stock is synchronized with inventory

