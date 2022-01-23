import '../css/style.css';
import ApiService from './apiService';
import { Notify } from 'notiflix';
// const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import articleTmpl from '../tmpl/article.hbs';

const searchForm = document.querySelector('.search-form');
const loadMore = document.querySelector('.load-more');
const gallerySelector = document.querySelector('.gallery');
const pixabayApi = new ApiService();

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionType: 'alt',
  captionDelay: 200,
  captionPosition: 'bottom',
});

searchForm.addEventListener('submit', onSearchHandler);
loadMore.addEventListener('click', onLoadMoreHandler);

function onSearchHandler(e) {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.target;

  searchQuery.value.trim();

  if (searchQuery.value !== '') {
    // console.log(searchQuery.value);

    pixabayApi.query = searchQuery.value;
    pixabayApi.resetPage();
    // try {
    // } catch (e) {}
    pixabayApi
      .fetchData()
      .then(data => {
        if (data.hits.length > 0) {
          Notify.success(`Hooray! We found ${data.total} images.`);
        }
        return data.hits;
      })
      .then(hits => {
        clearHits();
        appendHitsMarkup(hits);
        loadMoreIsVisible();
        // console.log(`from index: ${pixabayApi.totalHits}`);
      });
    // gallery.refresh();
    // console.log(`in index: ${pixabayApi.totalHits}`);
  } else {
    Notify.failure('There is nothing to search!');
  }
}

function onLoadMoreHandler() {
  pixabayApi.fetchData().then(data => {
    appendHitsMarkup(data.hits);
    loadMoreIsVisible();
  });

  // gallery.refresh();
}

function appendHitsMarkup(hits) {
  gallerySelector.insertAdjacentHTML('beforeend', articleTmpl(hits));
}

function clearHits() {
  gallerySelector.innerHTML = '';
}

function loadMoreIsVisible() {
  if (getPagesCount() > pixabayApi.options.params.page) {
    loadMore.classList.add('is-visible');
  } else {
    loadMore.classList.remove('is-visible');
    Notify.failure("We're sorry, but you've reached the end of search results.");
  }
}

function getPagesCount() {
  return Math.ceil(pixabayApi.totalHits / pixabayApi.options.params.per_page);
}
