// This is Controller of this App

import Search from './models/Search';
import * as SearchView from './views/SearchView';
import { elements, renderLoader, clearLoader } from './base';

/** 
 * Global State of App
 * - Search Object
 * - Current Receipe Object
 * - Shopping List Object
 * - Liked Receipes
*/
const state = {};

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
  renderLoader();

  // 4. Search for the receipes
  await state.search.getResults();

  // 5. Render reult on UI
  clearLoader();
  SearchView.renderResult(state.search.result);
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchControl();
});

// event handler for pagination
elements.pagination.addEventListener('click', e => {
  let btn = e.target.closest('.btn-inline');

  if(btn) {
    const gotToPage = parseInt(btn.dataset.goto, 10);
    SearchView.clearResult();
    SearchView.clearPagination();
    SearchView.renderResult(state.search.result, gotToPage);
  }
});
