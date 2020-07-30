import axios from 'axios';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const output = await axios.get(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

      this.title = output.data.recipe.title;
      this.publisher = output.data.recipe.publisher;
      this.img = output.data.recipe.image_url;
      this.url = output.data.recipe.source_url;
      this.ingredients = output.data.recipe.ingredients;
    } catch (error) {
      alert('Sorry, could not get recipe details :(');
    }
  }

  calcTime() {
    /**
     * assume that there will be period. each period will have 3 ingredients. 
     * and each period take 15 minutes to cook that 3 ingredients.
     */
    // const numIng = this.ingredients.length;
    // const period = Math.ceil(numIng / 3);
    // this.time = period * 15;

    // assume that we need 5 minutes to cook for each ingredient.
    const numIng = this.ingredients.length;
    this.time = numIng * 5;
  }

  calcServings() {
    this.servings = 3;
  }

  parseIngredients() {
    const longUnits = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const shortUnits = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    const newIngredients = this.ingredients.map(el => {
      // 1. convert long unit to short unit
      let ingredient = el.toLowerCase();

      longUnits.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, shortUnits[i]);
      });

      // 2. remove parentheses from the ingredient
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // 3. parse a ingredient into count, unit and ingredient [ingredient => only text]
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(element => shortUnits.includes(element));

      let objIng;

      if(unitIndex > -1) {
        /**
         * there has a unit
         * ex: 4 cups; numCount = [4]
         * ex: 1-1/3 cups; numCount = [1-1/3] -> eval(1 + 1/3) -> 1.3
         * ex: 4 1/2 cups; numCount = [4, 1/2] -> eval(4 + 1/2) -> 4.5
         * numCount is a array which will have only number as it's element
         */
        
        const numCount = arrIng.slice(0, unitIndex);
        let count;

        if(numCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if(parseInt(arrIng[0], 10)) {
        /**
         * the first element of arrIng is a number, but it has no unit
         * ex: 1 bread
         */

        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if(unitIndex === -1) {
        // there has no unit also arrIng has no number at position 1

        objIng = {
          // count is defining how much. assume that initial count is 1.
          count: 1,
          unit: '',
          ingredient
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(el => {
      // Unitary Method -> ঐকিক নিয়ম
      el.count *= (newServings / this.servings);
    });
    
    this.servings = newServings;
  }
};
