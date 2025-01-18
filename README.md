
# LetShopsy
# E-Commerce MERN Stack Application

A full-featured e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application includes user authentication, an admin panel, responsive design, cart management, and payment integration.

![Homepage](src/frontend/components/Assets/Frontend_Assets/ecommerce.png)


## Features

### User Features
- **Sign Up/Login:** Secure user authentication using `bcrypt` for password hashing and `JWT` for token-based authentication.
- **Responsive Design:** Mobile-first design to ensure the website looks great on all devices.
- **Product Browsing:** View all products and search by category or name.
- **Cart Management:** Add, remove, and manage items in the cart.
- **Payment Integration:** Make payments securely with integrated payment APIs.

### Admin Features
- **Admin Panel:**add products, and manage products.
- **Add/Edit Products:** Add new products or update existing ones, including images and pricing.
- **Remove Products:** Delete products from the inventory.

## Tech Stack

### Frontend
- **React.js:** Dynamic, responsive, and interactive user interface.
- **Axios:** API communication with the backend.

### Backend
- **Node.js:** Backend server.
- **Express.js:** Framework for handling routes, middleware, and RESTful APIs.
- **Multer:** File upload handling (e.g., product images).
- **bcrypt:** Password hashing for secure authentication.
- **jsonwebtoken (JWT):** Token-based user authentication.

### Database
- **MongoDB:** NoSQL database for storing users, products, orders, and other data.

### Deployment
- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Vercel.
- **Database:** Hosted on MongoDB Atlas.

## Getting Started

### Prerequisites
- **Node.js**: Ensure you have Node.js installed.
- **MongoDB**: Set up a MongoDB instance or use MongoDB Atlas.
- **Environment Variables**: Add a `.env` file with the following keys:


### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adhibhuvanasandhya/E-commerce
   cd E-commerce
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Start the application:**
   - Backend:
     ```bash
     cd backend
     npm start
     ```
   - Frontend:
     ```bash
     cd frontend
     npm start
     ```

4. **Access the application:**
   - Frontend: `https://e-commerce-frontend-pied-five.vercel.app`
   - Backend: `https://e-commerce-backend-mu-sage.vercel.app`

### Deployment

1. **Frontend Deployment:** Use platforms like Vercel .
2. **Backend Deployment:** Use platforms like Render, Vercel, or AWS.
3. **Database:** Use MongoDB Atlas for cloud-hosted MongoDB.

## Folder Structure

```
ecommerce-mern/
├── frontend/
│   ├── public/
│   ├── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       ├── App.js
│       └── index.js
├── backend/
│   ├── server.js
│   ├── .env
│   
│   
│   
├── README.md
```

## APIs

### User APIs
- **POST /signup**: Register a new user.
- **POST /login**: Login existing user.
- **POST /addtocart**: Add items to the cart.
- **POST /removefromcart**: Remove items from the cart.
- **GET /getcart**: Fetch user's cart data.

### Admin APIs
- **POST /addproduct**: Add a new product.
- **GET /allproducts**: Fetch all products.
- **POST /removeproduct**: Remove a product by ID.

## Future Enhancements
- Add product reviews and ratings.
- Implement advanced search with filters.
-  payment gateways like scan to pay gpay and upi.
- Add email notifications for orders.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Developed by:** [Adhibhuvanasandhya](https://github.com/Adhibhuvanasandhya)
```
