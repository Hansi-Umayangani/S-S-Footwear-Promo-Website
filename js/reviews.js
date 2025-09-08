import { db } from "./firebase-config.js"; 
import { collection, query, orderBy, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const userMenu = document.getElementById("userMenu");
  const userDropdown = document.getElementById("userDropdown");
  const loginOption = document.getElementById("loginOption");
  const logoutOption = document.getElementById("logoutOption");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const reviewsContainer = document.querySelector(".reviews-container");

  // IDs for review analysis section
  const overallRateEl = document.getElementById("overall-rate");
  const overallStarsEl = document.getElementById("overall-stars");
  const reviewsCountEl = document.getElementById("reviews-count");
  const recommendationEl = document.getElementById("recommendation-percentage");

  const barFills = {
    5: document.getElementById("bar-5"),
    4: document.getElementById("bar-4"),
    3: document.getElementById("bar-3"),
    2: document.getElementById("bar-2"),
    1: document.getElementById("bar-1")
  };

  const barCounts = {
    5: document.getElementById("count-5"),
    4: document.getElementById("count-4"),
    3: document.getElementById("count-3"),
    2: document.getElementById("count-2"),
    1: document.getElementById("count-1")
  };
});


// -------- Highlight nav link --------
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) link.classList.add("active");
  });

  // -------- User dropdown toggle --------
  if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) userDropdown.style.display = "none";
    });
  }

  // -------- Utility: format "time ago" --------
  function timeAgo(timestamp) {
    if (!timestamp) return "";
    const seconds = (Date.now() - timestamp.toDate()) / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    if (days >= 1) return '${Math.floor(days)} day(s) ago';
    if (hours >= 1) return '${Math.floor(hours)} hour(s) ago';
    if (minutes >= 1) return '${Math.floor(minutes)} min(s) ago';
    return "Just now";
  }

  // -------- Render stars --------
  function renderStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += '<span class="star ${i <= rating ? "filled" : ""}">★</span>';
    }
    return stars;
  }

