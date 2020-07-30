import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const output = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);

      this.result = output.data.recipes;
    } catch (error) {
      alert('Please, enter some valid key word :(');
    }
  }
};
