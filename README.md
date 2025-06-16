

# 📦 Warehouse Optimization System

An intelligent, web-based system designed to optimize warehouse storage using the **0/1 Knapsack Algorithm** and **hashing techniques** for efficient product placement and retrieval. Built with **Node.js, Express, PostgreSQL, and EJS**, this platform ensures maximum space utilization and fast inventory access.

---

## 🚀 Features

- ✅ **User Authentication**
  - Secure sign-up and login with hashed passwords using `bcrypt`
  - Session management for authenticated routes

- 🏗️ **Warehouse Setup**
  - Create warehouses with custom dimensions
  - Automatically calculates usable space and manages racks/bins

- 📊 **Smart Inventory Management**
  - Add products in bulk with size, quantity, and priority
  - Uses **0/1 Knapsack Algorithm** for optimal bin allocation

- 🔍 **Fast Product Retrieval**
  - Locate products instantly using **hashing** (O(1) search time)
  - View rack/bin details for any product

- 💾 **PostgreSQL Integration**
  - Stores user data, warehouse structure, bins, racks, and product info

- 🌐 **Dynamic Frontend**
  - Built using **EJS templates** for interactive and responsive views

---

## 🛠️ Tech Stack

| Technology   | Purpose                      |
|--------------|------------------------------|
| Node.js      | Backend runtime              |
| Express.js   | Web server framework         |
| PostgreSQL   | Relational database          |
| EJS          | Server-side templating       |
| JavaScript   | Frontend & backend scripting |
| CSS / HTML   | UI styling and structure     |

---

## 🧠 Algorithms Used

- **0/1 Knapsack Algorithm**  
  Efficiently selects which products to place in bins for optimal space use.

- **Hashing**  
  Enables constant time (`O(1)`) lookup for quick product location and retrieval.

---

## 📸 Screenshots  
> Example:
> ![Warehouse Signup Page](./screenshots/signup.png);
> ![Warehouse Signup Page](./screenshots/otp.png);
> ![Warehouse Signup Page](./screenshots/home.png);
> ![Warehouse Signup Page](./screenshots/managingInv.png);
> ![Warehouse Signup Page](./screenshots/warehouse.png);



---



---

## 📌 Installation & Usage

```bash
# Clone the repository
git clone https://github.com/yourusername/warehouse-optimization.git

# Navigate to the project directory
cd warehouse-optimization

# Install dependencies
npm install

# Start the application
node app.js
```

## 👨‍💻 Author
Developed by Bikram Singh Bisht , Anukool Negi , Rahul singh Negi and Somesh uniyal 
Backend & Algorithm Developer | JavaScript & PostgreSQL Enthusiast


---


