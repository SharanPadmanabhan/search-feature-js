/**
 * Fuzzy searches the query in a string.
 * @param {string} query The query to be searched.
 * @returns {boolean} If the query is found in the string.
 */
String.prototype.fuzzySearch = function (query, caseSensitive = false) {
    let string = this;
    let needleLength = query.length;
    let haystackLength = string.length;

    if (!caseSensitive) {
        string = string.toLowerCase();
        query = query.toLowerCase();
    }

    if (needleLength > haystackLength) return false;

    if (needleLength === haystackLength) return query === string;

    outer: for (let i = 0, j = 0; i < needleLength; i++) {
        let needleCharacter = query.charCodeAt(i);
        for (; j < haystackLength; ) {
            if (string.charCodeAt(j++) === needleCharacter) {
                continue outer;
            }
        }
        return false;
    }
    return true;
};

Object.defineProperty(String.prototype, 'fuzzySearch', { enumerable: false, writable: false });
