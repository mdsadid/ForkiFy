export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResult: document.querySelector('.results__list'),
  pagination: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list')
};

/**
 * i have to select the parent element and pass the parent element to this function
 * so that, the renderLoader function works correctly.
 */
export const renderLoader = parent => {
  const loader = `
    <div class="loader">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector('.loader');
  if(loader) { loader.parentElement.removeChild(loader); }
};
