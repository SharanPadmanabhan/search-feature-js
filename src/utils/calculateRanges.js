/**
 * Splits the text into different ranges.
 * @param {string} string The result string.
 * @param {number[]} array The selection range.
 * @returns {number[][]} split ranges
 */
export const calculateRanges = (string, array) => {
    let ranges = [];
    let flatArray = array.flat();

    flatArray.push(0, string.length);
    flatArray = Array.from(new Set(flatArray)).sort((a, b) => a - b);

    for (let index = 1; index < flatArray.length; index++) {
        ranges.push(flatArray.slice(index - 1, index + 1));
    }

    return ranges;
};
