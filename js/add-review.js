import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// -------- Header / Nav Highlight Logic --------
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const userMenu = document.getElementById("userMenu");
  const userDropdown = document.getElementById("userDropdown");
  const loginOption = document.getElementById("loginOption");
  const logoutOption = document.getElementById("logoutOption");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  // Current page filename
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    const linkPage = href.split("/").pop();
    if (linkPage === currentPage) link.classList.add("active");
  });

  if (currentPage === "admin-login.html" && userMenu) {
    userMenu.classList.add("active");
  }

    // -------- Dropdown toggle (guarded) --------
  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) userDropdown.style.display = "none";
    });
  }

