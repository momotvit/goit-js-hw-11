import axios from "axios";
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const saerchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


const BASE_URL = 'https://pixabay.com/api/';
const MY_PIXABAY_KEY = '34627829-d5e7f4f80e7fff5284f95e391';
let page = 1;
const perPage = 40;
const options = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`;


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