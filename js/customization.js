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