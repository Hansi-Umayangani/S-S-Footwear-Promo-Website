import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Register User
createUserWithEmailAndPassword(auth, "test@example.com", "password123")
  .then(userCredential => {
    console.log("User signed up:", userCredential.user);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });

// Login User
signInWithEmailAndPassword(auth, "test@example.com", "password123")
  .then(userCredential => {
    console.log("User logged in:", userCredential.user);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
const app = initializeApp(firebaseConfig);
console.log("Firebase connected ✅", app.name);
