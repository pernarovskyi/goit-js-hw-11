const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25354007-4da20173cd76d61434be87abf';

export default class ApiService {
  constructor() {
    // this.q = '';
    // this.image_type = 'photo';
    // this.orientation = 'horizontal';
    // this.safesearch = 'true';
    // this.order = 'popular';
    // this.page = 1;
    // this.per_page = '40';
    this.totalHits = 0;

    this.options = {
      params: {
        key: KEY,
        q: '',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    };
  }

  async fetchData() {
    const response = await axios.get(BASE_URL, this.options);
    const { hits, total, totalHits } = response.data;
    // console.log(response);

    this.totalHits = total;
    // console.log(response.status);
    // console.log(total);
    // console.log(hits);
    if (response.status == 200) {
      this.incrementPage();
    }
    // console.log(`current page from constructor: ${this.options.params.page}`);
    return response.data;
  }

  /*
  async fetchData() {
    const url = `${BASE_URL}/?key=${KEY}&q=${this.q}&image_type=${this.image_type}&orientation=${this.orientation}&safesearch=${this.safesearch}&order=${this.order}&page=${this.page}&per_page=${this.per_page}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        this.incrementPage();
        // this.totalHits = data.totalHits;
        // console.log(this.totalHits);
        return data;
      });
  }*/

  incrementPage() {
    this.options.params.page += 1;
  }

  resetPage() {
    this.options.params.page = 1;
  }

  get Hits() {
    return this.totalHits;
  }

  get query() {
    return this.options.params.q;
  }

  set query(newQuery) {
    // this.q = newQuery;
    this.options.params.q = newQuery;
  }
}
