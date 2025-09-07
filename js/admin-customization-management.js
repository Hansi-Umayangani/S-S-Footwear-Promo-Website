import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ------------------- DOM ELEMENTS -------------------
const loginOption = document.getElementById("loginOption");
const logoutOption = document.getElementById("logoutOption");
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");
const requestsTableBody = document.querySelector(".requests-table tbody");
const btnPendingFilter = document.querySelector(".requests-filters button:nth-child(1)");
const btnAcceptedFilter = document.querySelector(".requests-filters button:nth-child(2)");
// Admin nav buttons
const btnProducts = document.getElementById("btn-products");
const btnReviews = document.getElementById("btn-reviews");
const btnCustomization = document.getElementById("btn-customization");

// ------------------- DROPDOWN -------------------
if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) userDropdown.style.display = "none";
  });
}

// ------------------- AUTH -------------------
onAuthStateChanged(auth, (user) => {
  if (loginOption && logoutOption) { // check they exist
    if (user) {
      loginOption.style.display = "none";
      logoutOption.style.display = "flex";
    } else {
      loginOption.style.display = "flex";
      logoutOption.style.display = "none";
    }
  }
});

// Logout
if (logoutOption) {
  logoutOption.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  });
}


// ------------------- ADMIN NAV HIGHLIGHT -------------------
document.addEventListener("DOMContentLoaded", () => {
  const url = window.location.href;

  if (url.includes("product-management.html")) {
    btnProducts.classList.add("active");
  } else if (url.includes("review-management.html")) {
    btnReviews.classList.add("active");
  } else if (url.includes("customization-management.html")) {
    btnCustomization.classList.add("active");
  }

  // Fetch requests after DOM is ready
  fetchCustomizationRequests();
});

