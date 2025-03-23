# 🛒 E-commerce Customer Frontend  

This is the **customer-facing frontend** for an **E-commerce platform** built using **Next.js (App Router) and TypeScript**, styled with **Tailwind CSS**. It integrates with a **FastAPI backend** to provide seamless shopping experiences, including category management and cart functionality.

## 🚀 Features  

✅ **Category Management** – Browse products by categories.  
✅ **User Authentication** – Register, login, and manage accounts.  
✅ **Cart System** – Add, remove, and update cart items.  
✅ **Dynamic UI** – Fast and responsive user experience with **Tailwind CSS**.  

## 🛠️ Tech Stack  

- **Frontend:** Next.js (App Router), TypeScript (TSX), Tailwind CSS  
- **Backend:** FastAPI (Python)  
- **Database:** MongoDB Cloud  
- **Authentication:** JWT (JSON Web Tokens)  

## 📂 Project Structure  

```plaintext
/src
 ├── components/   # Reusable UI components
 ├── pages/        # Next.js page components
 ├── hooks/        # Custom React hooks
 ├── services/     # API interaction functions
 ├── store/        # State management (if using Redux/Zustand)
 ├── styles/       # Global styles
 ├── utils/        # Helper functions
 ├── assets/       # Static files and images
 ├── config/       # Configuration files
 ├── context/      # Context API for global state management
 ├── layouts/      # Layout components for pages
```

## 🏗️ Installation & Setup  

### 1️⃣ Clone the Repository  

```bash
git clone https://github.com/Pranav-Patel-123/E-commerce-customer-frontend.git
cd E-commerce-customer-frontend
```

### 2️⃣ Install Dependencies  

```bash
npm install
```

### 3️⃣ Set Up Environment Variables  

Create a `.env.local` file in the root directory and configure it:  

```plaintext
NEXT_PUBLIC_API_URL=<Your FastAPI Backend URL>
```

### 4️⃣ Run the Development Server  

```bash
npm run dev
```
App will be available at: **[http://localhost:3000](http://localhost:3000)**  

## ⚡ API Integration  

This frontend communicates with the **FastAPI backend** for fetching product categories, managing user authentication, and handling the cart system. Ensure the backend is running for full functionality.  

## 📸 Screenshots  

_Add screenshots of the UI here to showcase the design and functionality._  

## 🤝 Contributing  

This project is **open for contributions**! 🎉  

- If you have ideas, improvements, or want to **add new features**, feel free to contribute.  
- The **payment integration** and **order management** are still pending, so contributors are welcome to help complete them.  

### Steps to Contribute  

1. **Fork** the repository  
2. **Create** a new branch (`git checkout -b feature-branch`)  
3. **Commit** your changes (`git commit -m "Added new feature"`)  
4. **Push** to your branch (`git push origin feature-branch`)  
5. **Create a Pull Request**  

## 📜 License  

This project is licensed under the **MIT License**.  

---

Feel free to contribute and help improve the project! 🚀  
