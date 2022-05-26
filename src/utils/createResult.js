import { calculateRanges } from './calculateRanges.js';
import {} from './compareArrays.js';

/**
 * @name searchResultTemplate
 * @type {HTMLTemplateElement}
 */
const searchResultTemplate = document.querySelector('.search-result-template');

/**
 * Creates a new result element.
 * @param {string} resultText The string
 * @returns The result element.
 */
export const createResult = (resultText, searchQuery) => {
    let result = searchResultTemplate.content.firstElementChild.cloneNode(true);
    let resultTextContainer = result.querySelector('.text');

    let ranges = [];
    for (let character of searchQuery) {
        let highlightStart = resultText.toLowerCase().indexOf(character.toLowerCase());
        let highlightEnd = highlightStart + 1;

        ranges.push([highlightStart, highlightEnd]);
    }

    let splitRanges = calculateRanges(resultText, ranges);
    splitRanges.forEach(([start, end]) => {
        let subString = document.createElement('span');
        subString.innerText = resultText.substring(start, end);

        for (let range of ranges) {
            if (range.equals([start, end])) {
                subString.style.fontWeight = 'bold';
            }
        }
        resultTextContainer.appendChild(subString);
    });
    return result;
};
