import { elements } from '../dom';

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResult = () => {
  elements.searchResult.innerHTML = '';
}

export const renderResult = recipes => {
  // recipes.forEach(renderRecipe);
  recipes.forEach(el => {
    const markUp = `
      <li>
        <a class="results__link" href="#${el.recipe_id}">
          <figure class="results__fig">
            <img src="${el.image_url}" alt="${el.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${el.title}</h4>
            <p class="results__author">${el.publisher}</p>
          </div>
        </a>
      </li>
    `;

    elements.searchResult.insertAdjacentHTML('beforeend', markUp);
  });
};
