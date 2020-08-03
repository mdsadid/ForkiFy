import { elements } from '../base';
import { limitRecipeTitle } from './SearchView';

export const toggleLikeBtn = isLiked => {
  /**
   * if isLiked is 'true' then it will be 'icon-heart'
   * if isLiked is 'false' then it will be 'icon-heart-outlined'
   */
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numOfLike => {
  elements.likeMenu.style.visibility = numOfLike > 0 ? 'visible' : 'hidden';
};

export const renderLikes = likedRecipe => {
  const markUp = `
    <li>
      <a class="likes__link" href="#${likedRecipe.id}">
        <figure class="likes__fig">
          <img src="${likedRecipe.img}" alt="${likedRecipe.title}">
        </figure>
        <div class="likes__data">
          <h4 class="likes__name">${limitRecipeTitle(likedRecipe.title)}</h4>
          <p class="likes__author">${likedRecipe.publisher}</p>
        </div>
      </a>
    </li>
  `;

  elements.likesList.insertAdjacentHTML('beforeend', markUp);
};

export const deleteLikes = id => {
  /**
   * here, i just don't want to delete the <a></a> tag or the likes__link, rather i want
   * to delete the whole list element. that's why i have used parentElement to select
   * the parent of that anchor tag.
   */
  const element = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;

  if (element) {
    element.parentElement.removeChild(element);
  }
};
