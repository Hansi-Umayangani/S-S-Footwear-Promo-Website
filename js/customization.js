import { auth, db } from "./firebase-config.js"; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ---------------------- DOM ELEMENTS ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const userMenu = document.getElementById("userMenu");
  const userDropdown = document.getElementById("userDropdown");
  const loginOption = document.getElementById("loginOption");
  const logoutOption = document.getElementById("logoutOption");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const customForm = document.getElementById("customRequestForm");

  const currentPage = window.location.pathname.split("/").pop();

});

// ---------------------- NAV LINK HIGHLIGHT ----------------------
  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) link.classList.add("active");
  });

  // ---------------------- USER ICON HIGHLIGHT ----------------------
  if (currentPage === "admin-login.html" && userMenu) {
    userMenu.classList.add("active");
  }

  // ---------------------- DROPDOWN TOGGLE ----------------------
  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
      userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) userDropdown.style.display = "none";
    });
  }

  // ---------------------- MOBILE MENU TOGGLE ----------------------
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }