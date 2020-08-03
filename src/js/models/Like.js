export default class Like {
  constructor() {
    // this likes array has been taken for the global state and to do some manipulation
    this.likes = [];
  }

  addLike(id, title, img, publisher) {
    const like = {
      id,
      title,
      img,
      publisher
    };

    this.likes.push(like);

    // persist data into localStorage
    this.persistData();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);

    // persist data into localStorage
    this.persistData();
  }

  isLiked(id) {
    /**
     * first case, passing an id which is exist in likes array then the left most
     * condition will be true. then checking the right most condition which will be 
     * also true. (ex: 0 !== -1 or 1 !== -1 or 2 !== -1 and so on...)
     * so the entire condition will return true and thus this recipe is liked.
     * 
     * second case, passing an id which is not exist in likes array then the left most
     * condition will be false. then checking the right most condition which will be
     * also false. (ex: as the left most condition will return false so the returned 
     * value will be -1. and now comparing -1 !== -1, which is actually false)
     * so the entire condition will return false and thus this recipe is not liked.
     */
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  persistData() {
    /**
     * first i have to convert the array into string, because localStorage always save
     * string as it's value.
     */
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  // this readStorage method will get the liked recipes from the localStorage
  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));

    if (storage) {
      this.likes = storage;
    }
  }
};
