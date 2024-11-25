const form = document.getElementById("recipeForm");
const recipeList = document.getElementById("recipeList");
const difficultyRange = document.getElementById("difficultyRange");
const difficultyValue = document.getElementById("difficultyValue");

// Load saved recipes when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadRecipes();
  setupSearchBar();
});

// Add search bar to the saved recipes section
function setupSearchBar() {
  const searchBar = document.createElement("div");
  searchBar.className = "form-group search-bar";
  searchBar.innerHTML = `
        <input 
            type="text" 
            id="searchRecipes" 
            placeholder="Search recipes..."
            class="search-input"
        >
    `;

  const savedRecipesSection = document.querySelector(
    ".saved-recipes-section h2",
  );
  savedRecipesSection.after(searchBar);

  // Add search functionality
  const searchInput = document.getElementById("searchRecipes");
  searchInput.addEventListener(
    "input",
    debounce((e) => {
      searchRecipes(e.target.value);
    }, 300),
  );
}

// Update difficulty value display
difficultyRange.addEventListener("input", (e) => {
  difficultyValue.textContent = e.target.value;
});

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const email = document.getElementById("authorEmail").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const newRecipe = {
    id: Date.now().toString(),
    name: document.getElementById("recipeName").value,
    description: document.getElementById("recipeDescription").value,
    difficulty: difficultyRange.value,
    type: document.getElementById("recipeType").value,
    email: email,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };

  saveRecipe(newRecipe);
  form.reset();
  difficultyValue.textContent = "3";
});

// Save recipe to localStorage
function saveRecipe(recipe) {
  const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  recipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  loadRecipes();
}

// Load and display recipes
function loadRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes") || "[]").sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  recipeList.innerHTML = "";
  recipes.forEach(createRecipeCard);

  if (recipes.length === 0) {
    recipeList.innerHTML = `
            <div class="no-recipes">
                <p>No recipes yet. Add your first recipe!</p>
            </div>
        `;
  }
}

// Create recipe card
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.innerHTML = `
        <div class="recipe-header">
            <h3>${recipe.name}</h3>
            <span class="recipe-type">${recipe.type}</span>
        </div>
        <p class="recipe-description">${recipe.description}</p>
        <div class="recipe-details">
            <span class="difficulty">
                ${"⭐".repeat(recipe.difficulty)}
                <span class="difficulty-text">${recipe.difficulty}/5</span>
            </span>
            <span class="date">Added: ${recipe.date}</span>
        </div>
        <button class="delete-btn" data-id="${recipe.id}">Delete</button>
    `;

  // Add hover effect using getComputedStyle
  card.addEventListener("mouseenter", (e) => {
    const computedStyle = getComputedStyle(e.currentTarget);
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
  });

  card.addEventListener("mouseleave", (e) => {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
  });

  recipeList.appendChild(card);
}

// Handle recipe deletion
recipeList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    e.stopPropagation();
    const id = e.target.dataset.id;

    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe(id);
    }
  }
});

// Delete recipe
function deleteRecipe(id) {
  let recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  recipes = recipes.filter((recipe) => recipe.id !== id);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  loadRecipes();
}

// Search recipes
function searchRecipes(searchTerm) {
  const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  recipeList.innerHTML = "";
  filteredRecipes.forEach(createRecipeCard);

  if (filteredRecipes.length === 0) {
    recipeList.innerHTML = `
            <div class="no-recipes">
                <p>No recipes found matching your search.</p>
            </div>
        `;
  }
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Random highlight effect
setInterval(() => {
  const cards = document.querySelectorAll(".recipe-card");
  cards.forEach((card) => card.classList.remove("highlight"));

  if (cards.length > 0) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    cards[randomIndex].classList.add("highlight");
  }
}, 3000);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Alt + A to focus on recipe name input
  if (e.altKey && e.key === "a") {
    e.preventDefault();
    document.getElementById("recipeName").focus();
  }

  // Alt + S to focus on search
  if (e.altKey && e.key === "s") {
    e.preventDefault();
    document.getElementById("searchRecipes")?.focus();
  }
});
