import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { 
  collection, query, orderBy, onSnapshot, 
  doc, deleteDoc, updateDoc, serverTimestamp, 
  addDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Elements
const loginOption = document.getElementById("loginOption");
const logoutOption = document.getElementById("logoutOption");
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");

// Toggle dropdown
userMenu.addEventListener("click", () => {
  userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
});

// Show/hide login/logout based on auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginOption.style.display = "none"; // hide login
    logoutOption.style.display = "flex"; // show logout
  } else {
    loginOption.style.display = "flex"; // show login
    logoutOption.style.display = "none"; // hide logout
  }
});

// Handle logout
logoutOption.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    window.location.href = "login.html"; // redirect after logout
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!userMenu.contains(e.target)) {
    userDropdown.style.display = "none";
  }
});

// Wait until DOM is loaded 
document.addEventListener("DOMContentLoaded", () => { 
  console.log("JS loaded, URL:", window.location.href);

  // Get admin nav buttons
  const btnProducts = document.getElementById("btn-products");
  const btnReviews = document.getElementById("btn-reviews");
  const btnCustomization = document.getElementById("btn-customization");

  // Get current page from URL
  const url = window.location.href;

  // Highlight the active button based on the current page
  if (url.includes("product-management.html")) {
    btnProducts.classList.add("active");
  } else if (url.includes("review-management.html")) {
    btnReviews.classList.add("active");
  } else if (url.includes("customization-management.html")) {
    btnCustomization.classList.add("active");
  }
});
