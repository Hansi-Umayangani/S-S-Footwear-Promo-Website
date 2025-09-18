import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

function App() {
  // 🔹 State for auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 State for products
  const [products, setProducts] = useState([]);

  // --- Authentication ---
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("User signed up: " + userCredential.user.email);
    } catch (error) {
      alert("Signup error: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in: " + userCredential.user.email);
    } catch (error) {
      alert("Login error: " + error.message);
    }
  };

  // --- Firestore ---
  const addProduct = async () => {
    try {
      await addDoc(collection(db, "products"), { name: "Sneakers", price: 2500 });
      alert("Product added ✅");
      fetchProducts();
    } catch (error) {
      alert("Error adding product: " + error.message);
    }
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Firebase + React (Single File Demo)</h1>

      {/* --- Auth Section --- */}
      <h2>Authentication</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Log In</button>

      {/* --- Firestore Section --- */}
      <h2>Products</h2>
      <button onClick={addProduct}>Add Product</button>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} - Rs.{p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
