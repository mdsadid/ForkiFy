import { elements } from '../base';

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResult = () => {
  elements.searchResult.innerHTML = '';
};

export const clearPagination = () => {
  elements.pagination.innerHTML = '';
};

/**
 * Example: "Pizza with tomato and spinach"
 * after split method execute there will be an array containing
 * ['Pizza', 'with', 'tomato', 'and', 'spinach']
 * 
 * acc: 0 / acc + cur.length = 5 / True / newTitle = ['Pizza']
 * acc: 5 / acc + cur.length = 9 / True / newTitle = ['Pizza', 'with']
 * acc: 9 / acc + cur.length = 15 / True / newTitle = ['Pizza', 'with', 'tomato']
 * acc: 15 / acc + cur.length = 18 / False / newTitle = ['Pizza', 'with', 'tomato']
 * acc: 18 / acc + cur.length = 25 / False / newTitle = ['Pizza', 'with', 'tomato']
 */
const limitRecipeTitle = (title, limit = 18) => {
  if(title.length > limit) {
    const newTitle = [];
    /**
     * split method will convert the title (string) into an array
     * then reduce method will manipulate that array and create a new reduced array
     */
    title.split(' ').reduce((acc, cur) => {
      if(acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      // then return a value to reduce method to work as a loop
      return acc + cur.length;
    }, 0);

    // return the result by converting the array into a string using join method
    return `${newTitle.join(' ')}...`;
  } else {
    return title;
  }
};

// type: 'prev' or 'next'
const createButton = (pageNum, type) => {
  let btnMarkUp = `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'next' ? pageNum + 1 : pageNum - 1}">
      <span>Page ${type === 'next' ? pageNum + 1 : pageNum - 1}</span>
      <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
      </svg>
    </button>
  `;

  return btnMarkUp;
};

const renderButton = (pageNum, totalRecipes, recipePerPage = 10) => {
  const totalPage = Math.ceil(totalRecipes / recipePerPage);
  let button;

  if(pageNum === 1 && totalPage > 1) {
    // render only the next button
    button = createButton(pageNum, 'next');
  } else if (pageNum > 1 && pageNum < totalPage) {
    // render both the previous and next button
    button = `
      ${createButton(pageNum, 'prev')}
      ${createButton(pageNum, 'next')}
    `;
  } else if (pageNum === totalPage && totalPage > 1) {
    // render only the previous button
    button = createButton(pageNum, 'prev');
  }

  elements.pagination.insertAdjacentHTML('afterbegin', button);
};

export const renderResult = (recipes, pageNum = 1, recipePerPage = 10) => {
  // render the result of current page
  const start = (pageNum - 1) * recipePerPage;
  const end = pageNum * recipePerPage;

  recipes.slice(start, end).forEach(el => {
    const markUp = `
      <li>
        <a class="results__link" href="#${el.recipe_id}">
          <figure class="results__fig">
            <img src="${el.image_url}" alt="${el.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(el.title)}</h4>
            <p class="results__author">${el.publisher}</p>
          </div>
        </a>
      </li>
    `;

    elements.searchResult.insertAdjacentHTML('beforeend', markUp);
  });

  // render the pagination button
  renderButton(pageNum, recipes.length);
};
