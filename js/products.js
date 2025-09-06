import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ------------------- NAV / AUTH LOGIC -------------------
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const userMenu = document.getElementById("userMenu");
  const userDropdown = document.getElementById("userDropdown");
  const loginOption = document.getElementById("loginOption");
  const logoutOption = document.getElementById("logoutOption");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) link.classList.add("active");
  });

  if (currentPage === "admin-login.html") userMenu.classList.add("active");

  userMenu.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) userDropdown.style.display = "none";
  });

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  if (typeof auth !== "undefined") {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loginOption.style.display = "none";
        logoutOption.style.display = "flex";
        userMenu.classList.add("active");
      } else {
        loginOption.style.display = "flex";
        logoutOption.style.display = "none";
        if (currentPage !== "login.html") userMenu.classList.remove("active");
      }
    });

    logoutOption.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
    });
  }
});