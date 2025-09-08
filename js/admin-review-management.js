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
    loginOption.style.display = "none"; 
    logoutOption.style.display = "flex";
  } else {
    loginOption.style.display = "flex"; 
    logoutOption.style.display = "none"; 
  }
});

// Handle logout
logoutOption.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    window.location.href = "login.html"; 
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
});

document.addEventListener("click", (e) => {
  if (!userMenu.contains(e.target)) {
    userDropdown.style.display = "none";
  }
});

// ---------------------- ADMIN NAV HIGHLIGHT ----------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded, URL:", window.location.href);

  const url = window.location.href;
  if (url.includes("product-management.html")) {
    btnProducts.classList.add("active");
  } else if (url.includes("review-management.html")) {
    btnReviews.classList.add("active");
  } else if (url.includes("customization-management.html")) {
    btnCustomization.classList.add("active");
  }

  // Load reviews from Firestore
  loadReviews();
});
