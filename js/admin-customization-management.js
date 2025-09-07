import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// ------------------- DOM ELEMENTS -------------------
const loginOption = document.getElementById("loginOption");
const logoutOption = document.getElementById("logoutOption");
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");
const requestsTableBody = document.querySelector(".requests-table tbody");
const btnPendingFilter = document.querySelector(".requests-filters button:nth-child(1)");
const btnAcceptedFilter = document.querySelector(".requests-filters button:nth-child(2)");
// Admin nav buttons
const btnProducts = document.getElementById("btn-products");
const btnReviews = document.getElementById("btn-reviews");
const btnCustomization = document.getElementById("btn-customization");

// ------------------- DROPDOWN -------------------
if (userMenu && userDropdown) {
    userMenu.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) userDropdown.style.display = "none";
  });
}

// ------------------- AUTH -------------------
onAuthStateChanged(auth, (user) => {
  if (loginOption && logoutOption) { // check they exist
    if (user) {
      loginOption.style.display = "none";
      logoutOption.style.display = "flex";
    } else {
      loginOption.style.display = "flex";
      logoutOption.style.display = "none";
    }
  }
});

// Logout
if (logoutOption) {
  logoutOption.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  });
}


// ------------------- ADMIN NAV HIGHLIGHT -------------------
document.addEventListener("DOMContentLoaded", () => {
  const url = window.location.href;

  if (url.includes("product-management.html")) {
    btnProducts.classList.add("active");
  } else if (url.includes("review-management.html")) {
    btnReviews.classList.add("active");
  } else if (url.includes("customization-management.html")) {
    btnCustomization.classList.add("active");
  }

  // Fetch requests after DOM is ready
  fetchCustomizationRequests();
});

// ------------------- FETCH CUSTOMIZATION REQUESTS (FETCH & RENDER) -------------------
async function fetchCustomizationRequests() {
  if (!requestsTableBody) return;

  requestsTableBody.innerHTML = ""; // clear old rows

  try {
    const q = query(collection(db, "customRequests"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      requestsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:10px;">No requests found.</td>
        </tr>
      `;
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const request = docSnap.data();
      const date = request.timestamp?.toDate().toLocaleDateString() || "";

      const row = document.createElement("tr");
      row.setAttribute("data-id", docSnap.id);

      row.innerHTML = `
        <td>${date}</td>
        <td>${request.customerName || "-"}</td>
        <td>${request.productType || "-"}</td>
        <td>${request.emailAddress || "-"}<br>${request.contactNumber || ""} (${request.contactMethod || ""})</td>
        <td>${request.customDetails || "-"}</td>
        <td>
          <button class="status-btn ${request.status?.toLowerCase() || "pending"}">
            ${request.status || "Pending"}
          </button>
        </td>
        <td class="actions">
          <button class="delete" title="Delete">
            <img src="/assets/icons/trash.png" alt="Delete" class="delete-icon">
          </button>
        </td>
      `;

      // Handle status toggle
      const statusBtn = row.querySelector(".status-btn");
      statusBtn.addEventListener("click", async () => {
        let newStatus;

        if (statusBtn.classList.contains("pending")) {
          newStatus = "Accepted"; 
        } else {
          newStatus = "Pending"; 
        }

        try {
          await updateDoc(doc(db, "customRequests", docSnap.id), {
            status: newStatus
          });

          // Update UI
          statusBtn.textContent = newStatus;
          statusBtn.className = "status-btn " + newStatus.toLowerCase();
        } catch (err) {
          console.error("Failed to update status:", err);
        }
      });

 

      requestsTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to fetch requests:", err);
  }
}

