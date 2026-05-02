<<<<<<< HEAD
# Victoria Baby Essentials 👶✨

Victoria Baby Essentials is a premium e-commerce platform dedicated to providing high-quality baby products. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a seamless shopping experience with a focus on aesthetics, security, and performance.

## 🚀 Features
=======
# Victoria Baby Essentials 

Victoria Baby Essentials is a premium e-commerce platform dedicated to providing high-quality baby products. Built with the MERN stack (MongoDB, Express, React, Node.js), it offers a seamless shopping experience with a focus on aesthetics, security, and performance.

## Features
>>>>>>> 022cb1fc0616673a60295422727c927201c7eb6d

- **User Authentication**: Secure signup and login using JWT and Bcrypt hashing.
- **Product Management**: Browse through a curated collection of baby essentials with detailed descriptions and high-quality images.
- **Shopping Cart**: Dynamic cart management with real-time updates.
- **Order History**: View past orders with detailed item lists and interactive options like "View" and "Reorder".
- **Secure Payments**: Integrated with **Flutterwave** for seamless Nigerian banking integration (Cards, Transfers, USSD).
- **Admin Dashboard**: Comprehensive management of products, orders, and users.
- **Responsive Design**: Optimized for mobile, tablet, and desktop views.
- **Automated Emails**: Integrated with Nodemailer for order confirmations and status updates.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, TypeScript, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **State Management**: React Context API.
- **Payments**: Flutterwave API.
- **File Uploads**: Multer.

<<<<<<< HEAD
## 📋 Prerequisites
=======
##  Prerequisites
>>>>>>> 022cb1fc0616673a60295422727c927201c7eb6d

- Node.js (v16+)
- MongoDB (Local or Atlas)
- Flutterwave API Keys

<<<<<<< HEAD
## ⚙️ Installation & Setup
=======
##  Installation & Setup
>>>>>>> 022cb1fc0616673a60295422727c927201c7eb6d

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd victoria-baby-essentials
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   VITE_FLUTTERWAVE_PUBLIC_KEY=your_public_key
   FLUTTERWAVE_SECRET_KEY=your_secret_key
   FLUTTERWAVE_ENCRYPTION_KEY=your_encryption_key
   ```

4. **Seed Database (Optional)**:
   ```bash
   # From root directory
   npm run data:import
   ```

5. **Run the application**:
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   ```

<<<<<<< HEAD
## 📜 Scripts
=======
##  Scripts
>>>>>>> 022cb1fc0616673a60295422727c927201c7eb6d

- `npm run dev`: Starts both frontend and backend in development mode.
- `npm run server`: Starts the backend server only.
- `npm run client`: Starts the frontend client only.
- `npm run build`: Builds the production bundle.
- `npm run data:import`: Imports sample data into MongoDB.
- `npm run data:destroy`: Clears the database.

## 📄 License

This project is licensed under the ISC License.
