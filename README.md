# 🛒 Gourmet Marketplace Management System

A comprehensive full-stack application for managing a gourmet marketplace / sweet shop, including product inventory, customer management, order processing, and administrative controls.

---

## 📋 Table of Contents

* [✨ Features](#-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [📦 Prerequisites](#-prerequisites)
* [🚀 Installation](#-installation)
* [⚙️ Configuration](#️-configuration)
* [🏃 Running the Application](#-running-the-application)
* [🔑 Default Credentials](#-default-credentials)
* [📁 Project Structure](#-project-structure)
* [🔌 API Endpoints](#-api-endpoints)
* [📊 Features Overview](#-features-overview)
* [🧪 Testing](#-testing)
* [🔧 Troubleshooting](#-troubleshooting)
* [🔒 Security Considerations](#-security-considerations)
* [📄 License](#-license)
* [👥 Support](#-support)

---

## ✨ Features

### 🔐 Admin Features

* Secure admin authentication (username/password)
* Product management with categories
* Inventory management with low-stock alerts
* Customer management
* Order processing and tracking
* Dashboard with statistics
* Search and filter functionality

### 👤 Customer Features

* Public customer registration
* Browse available products
* Place orders
* View order history
* Fully responsive UI

---

## 🛠️ Tech Stack

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js (v5.1.0)
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT (JSON Web Tokens)
* **Password Hashing:** bcryptjs
* **Testing:** Jest + Supertest

### Frontend

* **Framework:** React (v18.2.0)
* **Build Tool:** Vite
* **Routing:** React Router DOM (v6.20.0)
* **HTTP Client:** Axios
* **Testing:** Vitest + Testing Library

---

## 📦 Prerequisites

Ensure the following are installed before proceeding:

* **Node.js** (v14 or higher)
* **MongoDB** (local or MongoDB Atlas)
* **npm** or **yarn**
* **Git** (optional)

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd "sweet shop"
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Navigate to the backend directory
2. Create a `.env` file:

```bash
cp env.example .env
```

3. Update `.env` with your values:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
DB_NAME=gourmet_marketplace
TOKEN_SECRET=your-secure-secret
TOKEN_EXPIRY=7d
ORIGIN1=http://localhost:5173
```

> ⚠️ **Important:** Change `TOKEN_SECRET` in production.

---

### Frontend Configuration

Update API base URL if backend port differs:

```js
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

---

## 🏃 Running the Application

### Step 1: Start MongoDB

```bash
mongod
```

### Step 2: Create Admin User

```bash
cd backend
node src/scripts/createAdmin.js
```

**Default Admin Credentials:**

* Username: `admin`
* Password: `admin123`

---

### Step 3: Start Backend Server

```bash
npm run dev
```

Backend runs at: `http://localhost:8000`

---

### Step 4: Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Default Credentials

### Admin Login

* URL: `/admin/login` or `/login`
* Username: `admin`
* Password: `admin123`

### Customer Registration

* URL: `/customer/login`
* Register using Name and Phone Number

---

## 📁 Project Structure

```
sweet shop/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── scripts/
│   │   ├── db/
│   │   ├── app.js
│   │   └── index.js
│   ├── tests/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

* `POST /api/v1/users/admin/login`
* `POST /api/v1/users/logout`

### Categories

* `GET /api/v1/categories`
* `POST /api/v1/categories` *(Protected)*
* `PUT /api/v1/categories/:id` *(Protected)*
* `DELETE /api/v1/categories/:id` *(Protected)*

### Products

* `GET /api/v1/products`
* `POST /api/v1/products` *(Protected)*
* `GET /api/v1/products/low-stock` *(Protected)*

### Customers

* `POST /api/v1/customers/register` *(Public)*
* `GET /api/v1/customers` *(Protected)*

### Orders

* `POST /api/v1/orders`
* `POST /api/v1/orders/customer` *(Public)*
* `GET /api/v1/orders/stats` *(Protected)*

---

## 📊 Features Overview

* Product & category management
* Real-time inventory tracking
* Order lifecycle management
* Customer analytics & history
* Low-stock alerts & restocking

---

## 🧪 Testing

### Backend

```bash
npm test
npm run test:watch
```

### Frontend

```bash
npm test
npm run test:coverage
```

---

## 🔧 Troubleshooting

**MongoDB connection error**

* Ensure MongoDB is running
* Verify `MONGODB_URI`

**Port already in use**

* Change port in `.env`

**Admin login not working**

* Run `createAdmin.js`
* Check backend logs

---

## 🔒 Security Considerations

* Change default admin credentials
* Use strong JWT secrets
* Enable HTTPS in production
* Sanitize user inputs
* Keep dependencies updated

---

## 📄 License

ISC

---

## 👥 Support

For issues or contributions, please refer to the repository or contact the development team.

---

**Happy Coding! 🎉**
