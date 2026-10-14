# 🛒 ShopKart — Full-Stack MERN E-Commerce Platform

ShopKart is a full-stack e-commerce application engineered across a 6-part architecture sequence (Lab 01 to Lab 06). It implements stateless JWT authentication via `HttpOnly` cookies, debounced catalog search and sorting, atomic wishlist persistence, synchronized global cart state via the React Context API, and cryptographically verified Razorpay Test Mode payment processing with immutable order snapshots.

---

## 🏗️ System Architecture & Lab Progression

* **Lab 01 & 02 — Identity & Client-Server Authentication:** MVC backend architecture with custom JWT authentication stored in `HttpOnly` cookies (`withCredentials: true`) to prevent XSS token exfiltration.
* **Lab 03 — Product Catalog & Filtering Engine:** Server-side search, category filtering, and price sorting paired with a 300ms client-side debounce mechanism.
* **Lab 04 — Persistent Wishlist System:** Relational document referencing (`ObjectId`) utilizing atomic MongoDB operators (`$addToSet`, `$pull`) and `.populate()` projections for $O(1)$ UI state lookup.
* **Lab 05 — Shopping Cart & Global State Synchronization:** Quantity-aware nested subdocuments with strict server-side stock validation, synchronized across the React component tree (`Navbar`, `ProductCard`, `ProductDetails`, `Cart`) via `CartContext` and derived state calculations.
* **Lab 06 — Transactional Checkout, Razorpay & Order Snapshots:** Two-phase order commit workflow featuring server-side price recalculation, historical product snapshotting, Razorpay Order generation (paise conversion), and `HMAC-SHA256` signature verification.

---

## 📂 Project Structure

```text
ShopKart/
├── client/
│   └── vite-project/                # React + Vite Frontend (Port 5173)
│       ├── public/                  # Static public assets
│       ├── src/
│       │   ├── assets/              # Application images & icons
│       │   ├── axiosCalls/          # Axios configuration & request helpers
│       │   ├── components/          # Reusable UI (Navbar, ProductCard, SearchBar, WishlistCard, CartItem)
│       │   ├── context/             # Global Cart State Provider (CartContext.jsx)
│       │   ├── pages/               # Route Views (Login, Register, Home, Products, ProductDetails, Wishlist, Cart, Checkout, Orders)
│       │   ├── services/            # Centralized API Service Layer (api.js)
│       │   ├── App.css              # Component-level styles
│       │   ├── App.jsx              # Root Router & Context Wrapper
│       │   ├── index.css            # Tailwind CSS & global directives
│       │   └── main.jsx             # React DOM entry point
│       ├── .gitignore               # Frontend Git ignore rules
│       ├── eslint.config.js         # ESLint configuration
│       ├── index.html               # HTML entry template
│       ├── package-lock.json
│       ├── package.json             # Frontend dependencies & scripts
│       └── vite.config.js           # Vite bundler configuration
│
├── server/                          # Node.js + Express Backend (Port 8005)
│   ├── config/                      # Database connection & Razorpay instance (razorpay.js)
│   ├── controllers/                 # Route handlers (customer, product, wishlist, cart, order)
│   ├── middlewares/                 # JWT authentication guard (auth.middleware.js)
│   ├── models/                      # Mongoose Schemas (customer, product, order)
│   ├── routes/                      # Express API routers
│   ├── utils/                       # Backend helper utilities & response formatters
│   ├── .env.example                 # Template for required environment variables
│   ├── .gitignore                   # Backend Git ignore rules (excludes .env & node_modules)
│   ├── index.js                     # Express application entry point
│   └── package.json                 # Backend dependencies & scripts
│
└── README.md                        # Project documentation
```

---

## 🛠️ Tech Stack

* **Frontend:** React 18 (Vite), React Router DOM, React Context API, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js (ES Modules)
* **Database:** MongoDB & Mongoose ODM
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `cookie-parser`, CORS
* **Payment Gateway:** Razorpay Standard Checkout (Test Mode), Node.js built-in `crypto` (`HMAC-SHA256`)

---

## ⚙️ Local Setup & Run Instructions

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Local instance or MongoDB Atlas cluster)
* **Razorpay Account** (Switched to **Test Mode** for API keys)

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ShopKart
```

### 2. Backend Setup (`server`)
Navigate to the `server` directory and install the backend dependencies:
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory based on `.env.example` (**never commit `.env` to GitHub**):
```env
PORT=8005
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Razorpay Test Mode Credentials
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_test_secret_here
```

Start the backend server:
```bash
npm run dev
```
*The backend API will run on `http://localhost:8005`.*

### 3. Frontend Setup (`client/vite-project`)
Open a new terminal window, navigate to `client/vite-project`, and install dependencies:
```bash
cd client/vite-project
npm install
```

Start the Vite frontend server:
```bash
npm run dev
```
*The React application will run on `http://localhost:5173`.*

---

## 🔌 API Reference

All protected routes (`✅`) require an active session cookie transmitted via `withCredentials: true`.

| Module | Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :---: | :--- |
| **Auth** | `POST` | `/customers/register` | ❌ | Register a new customer |
| **Auth** | `POST` | `/customers/login` | ❌ | Authenticate & issue `HttpOnly` JWT cookie |
| **Auth** | `POST` | `/customers/logout` | ✅ | Clear session cookie |
| **Auth** | `GET` | `/customers/me` | ✅ | Retrieve logged-in customer profile |
| **Catalog** | `GET` | `/products` | ❌ | List products with `?search=`, `?category=`, `&sort=` |
| **Catalog** | `GET` | `/products/:id` | ❌ | Fetch single product details |
| **Wishlist** | `GET` | `/wishlist` | ✅ | Get populated wishlist for current customer |
| **Wishlist** | `PATCH` | `/wishlist/:productId/toggle` | ✅ | Atomically toggle product in wishlist (`$addToSet` / `$pull`) |
| **Cart** | `GET` | `/cart` | ✅ | Get populated cart items & quantities |
| **Cart** | `POST` | `/cart/:productId` | ✅ | Add product to cart or increment quantity (validates stock) |
| **Cart** | `PATCH` | `/cart/:productId` | ✅ | Update item quantity (`1 <= quantity <= stock`) |
| **Cart** | `DELETE` | `/cart/:productId` | ✅ | Remove item from cart |
| **Orders** | `POST` | `/orders/create-payment-order` | ✅ | Validate stock, snapshot items, create pending order & Razorpay order |
| **Orders** | `POST` | `/orders/verify-payment` | ✅ | Verify HMAC-SHA256 signature, mark order `PAID`/`PLACED`, clear cart |
| **Orders** | `GET` | `/orders` | ✅ | Fetch authenticated customer's order history |
| **Orders** | `GET` | `/orders/:id` | ✅ | Fetch single order by ID (enforces ownership check) |

---

## 🧪 End-to-End Verification Checklist

1. **Authentication:** Register/login and verify the `HttpOnly` cookie is attached on subsequent requests.
2. **Wishlist & Cart Sync:** Toggle wishlist items and update cart quantities; verify the Navbar badge updates in real time without a page reload.
3. **Stock Guardrails:** Attempt to increment cart quantity beyond available product stock; verify `400 Bad Request` enforcement.
4. **Razorpay Test Checkout:** Enter a valid 6-digit pincode and 10-digit phone number on `/checkout`, complete a test payment in the Razorpay modal, and verify that the signature passes HMAC validation, the order transitions to `PAID` / `PLACED`, and the cart resets to `0`.

---

## 🔐 Security & Business Rules Implemented

* **Server-Side Price & Stock Authority:** The server ignores any `totalAmount` sent by the client. Product prices and stock levels are re-queried directly from MongoDB during checkout, and the final total is converted to paise (`Math.round(totalAmount * 100)`) on the server.
* **Purchase-Time Snapshotting:** Each order stores an immutable copy of `name`, `price`, `quantity`, and `image` inside `order.items` so future catalog updates do not alter historical orders.
* **Mandatory Signature Verification:** The customer's cart remains intact until `/orders/verify-payment` validates `razorpayOrderId + "|" + razorpay_payment_id` against `RAZORPAY_KEY_SECRET` using `crypto.createHmac("sha256")`.
* **Credential Hygiene:** All sensitive keys reside strictly in `server/.env` (excluded via `.gitignore`), with `server/.env.example` committed for reference.
