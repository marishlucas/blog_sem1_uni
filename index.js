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

document.addEventListener("DOMContentLoaded", () => {
  fetchRecipes();
});

async function fetchRecipes() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayRecipes(data.recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    document.getElementById("recipes-container").innerHTML =
      "<p>Sorry, we couldn't load the recipes at this time.</p>";
  }
}

function displayRecipes(recipes) {
  const container = document.getElementById("recipes-container");

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card";

    recipeCard.innerHTML = `
            <h2 class="recipe-title">${recipe.title}</h2>
            <p class="recipe-description">${recipe.description}</p>
            
            <div class="recipe-info">
                <span class="recipe-time">⏰ ${recipe.prepTime} + ${recipe.cookTime}</span>
                <span class="recipe-servings">👥 ${recipe.servings} servings</span>
                <span class="recipe-difficulty">📝 ${recipe.difficulty}</span>
            </div>
            
            <div class="recipe-tags">
                ${recipe.tags.map((tag) => `<span class="recipe-tag">${tag}</span>`).join("")}
            </div>
            
            <div class="recipe-rating">
                ${"⭐".repeat(Math.round(recipe.rating))} (${recipe.rating})
            </div>
            
            <div class="recipe-ingredients">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
                </ul>
            </div>
            
            <div class="recipe-instructions">
                <h3>Instructions</h3>
                <ol>
                    ${recipe.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
                </ol>
            </div>
        `;

    container.appendChild(recipeCard);
  });
}
