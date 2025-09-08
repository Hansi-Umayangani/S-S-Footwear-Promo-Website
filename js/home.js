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

  // -------- Highlight nav link --------
  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // -------- Highlight user icon --------
  if (currentPage === "admin-login.html") {
    userMenu.classList.add("active");
  }

  // -------- Dropdown toggle --------
  userMenu.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      userDropdown.style.display = "none";
    }
  });

  // -------- Mobile menu toggle --------
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // -------- Firebase Auth (optional if login/logout is needed) --------
  if (typeof auth !== "undefined") {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loginOption.style.display = "none";
        logoutOption.style.display = "flex";
        userMenu.classList.add("active"); // highlight when logged in
      } else {
        loginOption.style.display = "flex";
        logoutOption.style.display = "none";
        if(currentPage !== "admin-login.html") {
          userMenu.classList.remove("active");
        }
      }
    });

    // Logout
    logoutOption.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    });
  }
});
