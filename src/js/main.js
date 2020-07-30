// This is Controller of this App

import Search from './models/Search';
import * as SearchView from './views/SearchView';

import Recipe from './models/Recipe';
import * as RecipeView from './views/RecipeView';

import { elements, renderLoader, clearLoader } from './base';

/** 
 * Global State of App
 * - Search Object
 * - Current Receipe Object
 * - Shopping List Object
 * - Liked Receipes
*/
const state = {};

/**
 * Search Controller
 */
const searchControl = async () => {
  // 1. Get query from view
  const query = elements.searchInput.value;

  // 2. Create a new search object and store it into global state object
  if(query) {
    state.search = new Search(query);
  }

  // 3. Prepare or Reset UI for view
  SearchView.clearInput();
  SearchView.clearResult();
  SearchView.clearPagination();
  RecipeView.clearResult();
  renderLoader(document.querySelector('.results'));

  // 4. Search for the receipes
  await state.search.getResults();

  // 5. Render reult on UI
  clearLoader();
  SearchView.renderResult(state.search.result);
};

// Initial
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchControl();
});

// Event handler for pagination
elements.pagination.addEventListener('click', e => {
  let btn = e.target.closest('.btn-inline');

  if(btn) {
    const gotToPage = parseInt(btn.dataset.goto, 10);
    SearchView.clearResult();
    SearchView.clearPagination();
    SearchView.renderResult(state.search.result, gotToPage);
  }
});

/**
 * Recipe Controller
 */
const recipeControl = async () => {
  // Get the id from the url
  const id = window.location.hash.replace('#', '');
  
  if(id) {
    // 1. Prepare or Reset UI for view
    RecipeView.clearResult();
    renderLoader(document.querySelector('.recipe'));

    // 2. Create a new Recipe object
    state.recipe = new Recipe(id);

    // 3. Get recipe data
    await state.recipe.getRecipe();
    state.recipe.parseIngredients();

    // 4. Calculate time & how many people are going to serve
    state.recipe.calcTime();
    state.recipe.calcServings();

    // 5. Render recipe
    clearLoader();
    RecipeView.renderRecipe(state.recipe);
    // console.log(state.recipe);

    // 6. Highlight the selected recipe
    SearchView.highlightSelected(id);
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeControl));

// Handling Plus and Minus button click
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrease button has clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      RecipeView.updateServingsAndIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button has clicked
    state.recipe.updateServings('inc');
    RecipeView.updateServingsAndIngredients(state.recipe);
  }
  console.log(state.recipe);
});
