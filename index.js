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
