const hamburgerMenu = document.querySelector(".hamburger-menu");
const navMenu = document.getElementById("nav-menu");

hamburgerMenu.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (
    !hamburgerMenu.contains(event.target) &&
    !navMenu.contains(event.target)
  ) {
    navMenu.classList.remove("active");
  }
});

// Get the theme toggle button
const themeToggle = document.querySelector(".theme-toggle");

// Check for saved theme
let currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

// Update button text based on current theme
themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";
});
