import axios from "axios";
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let lightBox = refreshSimpleLightBox();
ma
const BASE_URL = 'https://pixabay.com/api/';
const MY_PIXABAY_KEY = '34627829-d5e7f4f80e7fff5284f95e391';
let page = 1;
const perPage = 30;
const options = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`;
let searchQuery = "";

searchForm.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);
loadMoreBtn.style.display = "none";

/// function for fetching images from the database
async function fetchImages(searchQuery) {
    const response = axios.get(
        `${BASE_URL}/?key=${MY_PIXABAY_KEY}&q=${searchQuery}&${options}&page=${page}`
    );
    return await response;
}


function incrementPage() { 
    page += 1;
}


function resetPage() {
    page = 1;
}


function findCount() {
    const count = res.data.totalHits/perPage;
}


async function onSearchSubmit(e) {
    e.preventDefault();
    clearMarkup();
    const form = e.currentTarget;
    searchQuery = form.elements.searchQuery.value.trim();
    console.log(searchQuery);
    if (!searchQuery) {
        clearMarkup();
        return Notify.failure("Please, fill the search field");

    }
    try {
        resetPage();
        const res = await fetchImages(searchQuery);
        const totalPage = res.data.totalHits;
        if (totalPage === 0) { 
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            clearMarkup();
            return;
        }
  renderMarkup(res.data.hits);
    Notify.success(`Hooray! We found ${totalPage} images.`);
     
    loadMoreBtn.style.display = 'inline-block';
    if (res.data.hits.length < 30) {
      onCollectionEnd();
    }

    }
    catch (error) {
        console.log(error);
        Notify.failure("Something went wrong!");
    }
    searchForm.reset();
};


async function onLoadMoreClick() { 
    incrementPage();
     lightBox.refresh();
    try {
        const result = await fetchImages(searchQuery);
        renderMarkup(result.data.hits);
     
        loadMoreBtn.style.display = "inline-block";
        onScroll();

        if (result.data.hits.length < 30) {
            onCollectionEnd();
        }
    } catch (error) {
        if ((error.response.status = 400))
        {
            onCollectionEnd();
        } else {
            Notify.failure("Something went wrong!");
        }
    
    }
}

////// Function for rendering the collection 

function renderMarkup(images) { 
 
    const markup = images.map(image => {
        const { webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads, } = image;
        
        return   `<a class="gallery__item" href="${largeImageURL}">
        <div class="photo-card">
        <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes</b>${likes}</p>
          <p class="info-item"><b>Views</b>${views}</p>
          <p class="info-item"><b>Comments</b>${comments}</p>
          <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
      </div>
    </a>`;
   
    }).join("");
    return gallery.insertAdjacentHTML("beforeend", markup);
}



function clearMarkup() { 
    gallery.innerHTML = '';
    loadMoreBtn.style.display = "none";
}


function refreshSimpleLightBox() {
 return new SimpleLightbox('.gallery a', {
    // captions: 'true',
    // captionsData: 'alt',
    captionDelay: 250,
    // nav: true,
    // navText: ['←','→'],
  });
}


function onCollectionEnd() {
  Notify.info("We're sorry, but you've reached the end of search results.", {
    showOnlyTheLastOne: true,
    cssAnimationDuration: 1000,
  });
  loadMoreBtn.style.display = 'none';
}



function onScroll() {

  const { height: cardHeight} = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}