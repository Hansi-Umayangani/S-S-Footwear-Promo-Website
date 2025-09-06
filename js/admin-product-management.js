import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, collection, addDoc,getDocs, deleteDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ----------------------- DOM ELEMENTS -----------------------
const loginOption = document.getElementById("loginOption");
const logoutOption = document.getElementById("logoutOption");
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");
const productForm = document.querySelector(".product-form");
const productName = document.getElementById("product-name");
const category = document.getElementById("category");
const price = document.getElementById("price");
const description = document.getElementById("description");
const previewImg = document.getElementById("preview-img");
const imagePreview = document.getElementById("image-preview");
const uploadBox = document.getElementById("upload-box");
const productsTbody = document.getElementById("products-tbody");

let uploadedImageURL = "";

// ----------------------- AUTH & NAVIGATION -----------------------
function initAuth() {
  if (!loginOption || !logoutOption) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginOption.style.display = "none";
      logoutOption.style.display = "flex";
      loadProducts(); // ✅ Load products here
    } else {
      loginOption.style.display = "flex";
      logoutOption.style.display = "none";
    }
  });

  logoutOption.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  });
}

function initDropdown() {
  if (!userMenu || !userDropdown) return;

  userMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.style.display =
      userDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      userDropdown.style.display = "none";
    }
  });
}

function highlightNav() {
  const btnProducts = document.getElementById("btn-products");
  const btnReviews = document.getElementById("btn-reviews");
  const btnCustomization = document.getElementById("btn-customization");
  const url = window.location.href;

  if (btnProducts && url.includes("product-management.html")) btnProducts.classList.add("active");
  if (btnReviews && url.includes("review-management.html")) btnReviews.classList.add("active");
  if (btnCustomization && url.includes("customization-management.html")) btnCustomization.classList.add("active");
}

// ----------------------- FIRESTORE -----------------------
const db = getFirestore();
const productsCollection = collection(db, "products");


// ----------------------- CLOUDINARY WIDGET -----------------------
function initCloudinary() {
  if (!window.cloudinary || !uploadBox) {
    console.error("Cloudinary widget not loaded or uploadBox missing.");
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "dvcmr9ojz",
      uploadPreset: "unsigned_preset",
      multiple: false,
      folder: "products",
    },
    (err, result) => {
      if (err) {
        console.error("Cloudinary upload error:", err);
      } else if (result && result.event === "success") {
        uploadedImageURL = result.info.secure_url;
        previewImg.src = uploadedImageURL;
        imagePreview.style.display = "block";
        console.log("Uploaded Image URL:", uploadedImageURL);
      }
    }
  );

  uploadBox.addEventListener("click", () => widget.open());
}
let editProductId = null;
// ----------------------- FORM SUBMISSION -----------------------
function initProductForm() {
  if (!productForm) return;

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = productName.value.trim();
    const cat = category.value.trim();
    const priceValue = parseFloat(price.value);
    const desc = description.value.trim();

    if (!name || !cat || !desc || isNaN(priceValue) || priceValue < 0) {
  alert("Please fill all fields correctly.");
  return;
}

// If adding a new product (not editing), image is required
if (!editProductId && !uploadedImageURL) {
  alert("Please upload a product image.");
  return;
}

try {
  if (editProductId) {
    // ---------------- UPDATE EXISTING PRODUCT ----------------
    await setDoc(doc(db, "products", editProductId), {
      name,
      category: cat,
      price: priceValue,
      description: desc,
      imageURL: uploadedImageURL,
      createdAt: serverTimestamp(),
    });

    alert("Product updated successfully!");
    editProductId = null; // Reset edit state
    productForm.querySelector(".submit-btn").textContent = "ADD PRODUCT"; // Back to add mode
  } else {
    // ---------------- ADD NEW PRODUCT ----------------
    await addDoc(productsCollection, {
      name,
      category: cat,
      price: priceValue,
      description: desc,
      imageURL: uploadedImageURL,
      createdAt: serverTimestamp(),
    });

    alert("Product added successfully!");
  }

  // Reset form
  productForm.reset();
  previewImg.src = "";
  imagePreview.style.display = "none";
  uploadedImageURL = "";

  // Reload table
  loadProducts();
} catch (err) {
  console.error("Error saving product:", err);
  alert("Failed to save product. Check console for details.");
}
});
}

