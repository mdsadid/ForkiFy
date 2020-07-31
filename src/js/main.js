// This is The Controller of This App

import Search from './models/Search';
import * as SearchView from './views/SearchView';

import Recipe from './models/Recipe';
import * as RecipeView from './views/RecipeView';

import List from './models/List';
import * as ListView from './views/ListView';

import { elements, renderLoader, clearLoader } from './base';

/** 
 * Global State of App
 * - Search Object
 * - Current Receipe Object
 * - Shopping List Object
 * - Liked Receipes
*/
const state = {};
window.state = state;

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
  ListView.clearList();
  renderLoader(document.querySelector('.results'));

  // 4. Search for the receipes
  await state.search.getResults();

  // 5. Render reult on UI
  clearLoader();
  SearchView.renderResult(state.search.result);
};
/**
 * End Of Search Controller
 */

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
    ListView.clearList();
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
/**
 * End Of Recipe Controller
 */

['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeControl));

/**
 * List Controller
 */
const listControl = () => {
  // 1. Create a new list if there has none yet
  if (!state.list) {
    state.list = new List();
  }

  // 2. Add all the ingredients in that shopping list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    ListView.renderItem(item);
  });
};
/**
 * End Of List Controller
 */

// Handle the update and delete events of list items
elements.shoppingList.addEventListener('click', e => {
  // first, get the id of that particular item
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // handle the delete event
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from state
    state.list.deleteItem(id);

    // delete from user interface
    ListView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    // handle the update event
    const val = parseFloat(e.target.value, 10);
    if (val > 0) {
      state.list.updateCount(id, val);
    }
  }
});

// Handling Plus, Minus and Add To button click
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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add to shopping list button has clicked
    listControl();
  }
});
