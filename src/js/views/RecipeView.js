import { elements } from '../base';
import { Fraction } from 'fractional';

export const clearResult = () => {
  elements.recipe.innerHTML = '';
};

// this formatCount method will convert the count into fractional view
const formatCount = count => {
  if (count) {
    /**
     * here i am going to use destructuring to contain integer and decimal value into
     * two separate variable. at first, i am going to convert the count into string
     * so that, i can use the split method to split the count and then i am going to use
     * map method to convert it int from string. because, count must have to be integer.
    */
    const [int, dec] = count.toString().split('.').map(item => parseInt(item, 10));

    // ex: if count = 2 then it will return the count.
    if(!dec) return count;

    if(int === 0) {
      // ex: count = 0.5 -> 1/2
      const fr = new Fraction(count);
      return `${fr.numerator}/${fr.denominator}`;
    } else {
      // ex: count = 2.5 -> 2 (1/2). here i have to only manipulate 0.5
      const fr = new Fraction(count - int);
      return `${int} ${fr.numerator}/${fr.denominator}`;
    }
  }

  return '?';
};

/**
 * this createIngredients method is calling to create all the ingredients.
 * and, this createIngredients method is calling from the built-in map method.
 * because, this createIngredients method is receiving an array for it's parameter.
 * so, the map method will call this createIngredients method to manipulate the array.
 * and, will create a new array. finally the join method will join all this ingredients
 * and create a long string of list.
 * also, can't use curly braces here. then it will not work.
 */
const createIngredients = element => `
  <li class="recipe__item">
    <svg class="recipe__icon">
      <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(element.count)}</div>
    <div class="recipe__ingredient">
      <span class="recipe__unit">${element.unit}</span>
      ${element.ingredient}
    </div>
  </li>
`;

export const renderRecipe = (recipe, isLiked) => {
  const markUp = `
    <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
      </div>

      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
          <button class="btn-tiny btn-decrease">
            <svg>
              <use href="img/icons.svg#icon-circle-with-minus"></use>
            </svg>
          </button>

          <button class="btn-tiny btn-increase">
            <svg>
              <use href="img/icons.svg#icon-circle-with-plus"></use>
            </svg>
          </button>
        </div>
      </div>

      <button class="recipe__love">
        <svg class="header__likes">
          <use href="img/icons.svg#${isLiked ? 'icon-heart' : 'icon-heart-outlined'}"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => createIngredients(el)).join('')}
      </ul>

      <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
          <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
      </button>
    </div>

    <div class="recipe__directions">
      <h2 class="heading-2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.publisher}</span>. Please check out directions at their website.
      </p>
      <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
      </a>
    </div>
  `;

  elements.recipe.insertAdjacentHTML('afterbegin', markUp);
};

export const updateServingsAndIngredients = recipe => {
  // 1. update servings view
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

  // 2. update ingredients view
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el, i) => {
    /**
     * here i have to pass the index, because ingredients is an array.
     * i am passing the new ingredients array that has been updated by clicking 
     * the plus or minus button.
     */
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
