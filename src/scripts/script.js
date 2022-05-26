import { searchResults } from './searchResults.js';
import { createResult } from '../utils/createResult.js';
import {} from '../utils/fuzzySearch.js';

/**
 * @name searchBarElement
 * @type {HTMLDivElement}
 */
const searchBarElement = document.querySelector('.search-bar');

/**
 * @name searchInputArea
 * @type {HTMLInputElement}
 */
const searchInputElement = searchBarElement.querySelector('.search-input');

/**
 * @name searchResultsElement
 * @type {HTMLUListElement}
 */
const searchResultsElement = document.querySelector('.search-results');

/**
 * @name querySearchResults
 * @type {string[]}
 */
let querySearchResults = [];

/**
 * @name currentResultIndex
 * @type {number}
 */
let currentResultIndex = 0;

/**
 * Finds The Search Results.
 * @param {string} searchQuery The search query to find results.
 * @returns Search Results.
 */
const getSearchResults = (searchQuery) => {
    if (searchQuery === '') return [];

    let results = [];
    searchResults.forEach((searchResultOption) => {
        if (searchResultOption.searchQuery.fuzzySearch(searchQuery)) {
            results.push(...searchResultOption.searchResults);
        } else {
            searchResultOption.searchSynonyms.forEach((synonym) => {
                if (synonym.fuzzySearch(searchQuery)) {
                    results.push(...searchResultOption.searchResults);
                }
            });
        }
    });

    return results;
};

/**
 * Displays The Search Results.
 * @param {string} searchQuery The search query to find results.
 */
const displayResults = (searchQuery) => {
    let count = 10;
    querySearchResults = getSearchResults(searchQuery);
    searchResultsElement.innerHTML = '';

    querySearchResults.forEach((searchResult) => {
        let result = createResult(searchResult, searchQuery);
        if (count-- > 0) {
            result.classList.add('show');
        }
        searchResultsElement.appendChild(result);
    });

    for (let searchResult of searchResultsElement.children) {
        searchResult.addEventListener('click', () => {
            searchResultsElement.innerHTML = '';
            searchInputElement.value = searchResult.querySelector('.text').innerText;
            searchResultsElement.appendChild(searchResult);
        });
    }
};

searchInputElement.addEventListener('input', () => {
    let searchQuery = searchInputElement.value.trim();
    currentResultIndex = 0;

    searchResultsElement.classList.toggle('show', searchQuery.length > 0);
    displayResults(searchQuery);

    if (querySearchResults.length <= 0) {
        searchResultsElement.classList.remove('show');
    }

    let results = [...document.querySelectorAll('.search-result')];

    let observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('show', entry.isIntersecting);
            });
        },
        {
            root: searchResultsElement,
            rootMargin: '50px',
        }
    );

    results.forEach((searchResult) => {
        observer.observe(searchResult);
    });
});

window.addEventListener('keydown', (event) => {
    if (searchResultsElement.childElementCount <= 0) return;

    let result,
        results = [...document.querySelectorAll('.search-result')];

    switch (event.code) {
        case 'ArrowDown':
            result = results.slice(currentResultIndex++ % results.length)[0];
            result.focus();
            break;

        case 'ArrowUp':
            result = results.slice(currentResultIndex-- % results.length)[0];
            result.focus();
            break;

        case 'Enter':
            result = results.slice(currentResultIndex % results.length)[0];
            searchInputElement.value = result.innerText;
            searchInputElement.focus();
            result.style.fontWeight = 'bold';
            searchResultsElement.innerHTML = '';
            searchResultsElement.appendChild(result);
            break;
    }
});
