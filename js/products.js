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

// ------------------- PRODUCTS LOGIC -------------------
const db = getFirestore();
const productsCollection = collection(db, "products");

const productGrid = document.getElementById("product-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.querySelector(".search-bar input");

let allProducts = [];
let currentFilter = "all";
let currentSearch = "";

// ------------------- CATEGORY MAP -------------------
const categoryMap = {
  "men-formal": "Men's Formal",
  "men-sandals": "Men's Sandals",
  "women-heels": "Women's Heels",
  "women-flats": "Women's Flats",
  "women-sandals": "Women's Sandals",
  "school-shoes": "School Shoes",
  "all": "all"
};

// ------------------- SEARCH SYNONYMS -------------------
const searchMap = {
  "heels": "Women's Heels",
  "flats": "Women's Flats",
  "sandals": ["Men's Sandals", "Women's Sandals"],
  "formal": "Men's Formal",
  "school": "School Shoes"
};

// ------------------- NORMALIZE TEXT -------------------
function normalizeText(text) {
  return text.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

// ------------------- DISPLAY PRODUCTS -------------------
function displayProducts(products, overrideCategories = null) {
  productGrid.innerHTML = "";

  const filteredProducts = products.filter(p => {
    const targetCategory = overrideCategories || [categoryMap[currentFilter]];

    // If targetCategory contains 'all', match everything
    const matchesCategory = targetCategory.includes("all") 
      ? true 
      : targetCategory.some(cat => normalizeText(cat) === normalizeText(p.category));

    const matchesSearch = normalizeText(p.name).includes(normalizeText(currentSearch));

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.setAttribute("data-category", product.category);

    card.innerHTML = `
      <img src="${product.imageURL}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">Rs. ${product.price.toFixed(2)}</div>
      <button class="request-btn">Request Custom</button>
    `;

    productGrid.appendChild(card);
  });
}

// ------------------ FILTER BUTTONS ------------------
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    currentSearch = ""; // reset search when changing category
    searchInput.value = "";
    displayProducts(allProducts);
  });
});

// ------------------ SEARCH BAR (Enter Key) ------------------
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const searchTerm = normalizeText(searchInput.value.trim());
    currentSearch = searchTerm;

    let overrideCategories = null;

    // Map search term to category if it's a synonym
    if (searchMap[searchTerm]) {
      const mappedCategory = searchMap[searchTerm];
      overrideCategories = Array.isArray(mappedCategory) ? mappedCategory : [mappedCategory];
    }

    displayProducts(allProducts, overrideCategories);
  }
});

// ------------------ LOAD PRODUCTS REALTIME ------------------
function loadProductsRealtime() {
  const q = query(productsCollection, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayProducts(allProducts);
  }, (error) => {
    console.error("Error fetching products:", error);
    productGrid.innerHTML = "<p>Failed to load products.</p>";
  });
}

// Initial load
document.addEventListener("DOMContentLoaded", loadProductsRealtime);

console.log("product.js loaded");