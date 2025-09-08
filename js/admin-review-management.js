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

// ---------------------- FORM ELEMENTS ----------------------
const reviewForm = document.querySelector(".review-form");
const reviewerNameInput = document.getElementById("reviewer-name"); 
const emailInput = document.getElementById("email");
const productInput = document.getElementById("product"); 
const ratingInput = document.getElementById("rating");
const reviewTextInput = document.getElementById("review-text");
const imagePreview = document.getElementById("image-preview");
const previewImg = document.getElementById("preview-img");
const submitBtn = reviewForm?.querySelector(".submit-btn"); 
let uploadedImageURL = "";
let editingReviewId = null;

// ---------------------- FETCH AND DISPLAY REVIEWS ----------------------
function loadReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    reviewsTableBody.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const review = docSnap.data();
      const id = docSnap.id;
      const { name, product, rating, reviewText, image, createdAt } = review;

      const dateStr = createdAt?.toDate ? createdAt.toDate().toLocaleString() : "";

      // Build rating stars
      let starsHTML = "";
      for (let i = 1; i <= 5; i++) {
        starsHTML += `<span class="star ${i <= rating ? "filled" : ""}">★</span>`;
      }

      // Build row
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${name}</td>
        <td class="rating-stars">${starsHTML}</td>
        <td>${product || ""}</td>
        <td class="review-comment">${reviewText || ""}</td>
        <td>${dateStr}</td>
        <td>
          ${image
            ? `<button class="view-image-btn" >
                <img src="/assets/icons/image.png" alt="View" style="width:20px; height:20px;">
              </button>`
            : "No Image"}
        </td>
        <td class="actions">
          <button type="button" class="edit">Edit</button>
          <button type="button" class="delete">Delete</button>
        </td>
      `;

      // Attach event listeners with correct review id
      tr.querySelector(".edit").addEventListener("click", () => {
        console.log("Edit clicked for ID:", id);
        handleEditReview(id);
      });
      tr.querySelector(".delete").addEventListener("click", () => {
        console.log("Delete clicked for ID:", id);
        handleDeleteReview(id);
      });

      // View image button (only if image exists)
      if (image) {
        tr.querySelector(".view-image-btn").addEventListener("click", () => {
          window.open(image, "_blank"); // opens the image in a new tab
        });
      }

      reviewsTableBody.appendChild(tr);
    });
  });
}