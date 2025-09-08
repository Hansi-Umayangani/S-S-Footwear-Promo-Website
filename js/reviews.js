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