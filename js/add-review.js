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

    // -------- Mobile Menu Toggle --------
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  // ---------- Add Review form + Cloudinary ----------
  const reviewForm = document.querySelector(".review-form");
  const uploadBox = document.getElementById("upload-box");
  const browseBtn = document.getElementById("browse-btn");
  const imagePreview = document.getElementById("image-preview");
  const previewImg = document.getElementById("preview-img");
  const ratingInput = document.getElementById("rating");
  let uploadedImageURL = "";

  function initCloudinary() {
    if (!window.cloudinary || !uploadBox) {
      console.warn("Cloudinary widget not available or uploadBox missing.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dvcmr9ojz",          // <-- your cloud name
        uploadPreset: "unsigned_preset", // <-- your unsigned preset
        multiple: false,
        folder: "reviews",
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return;
        }
        if (result && result.event === "success") {
          uploadedImageURL = result.info.secure_url;
          if (previewImg && imagePreview) {
            previewImg.src = uploadedImageURL;
            imagePreview.style.display = "block";
          }
        }
      }
    );

    uploadBox.addEventListener("click", () => widget.open());
    if (browseBtn) browseBtn.addEventListener("click", () => widget.open());
  }
  initCloudinary();

