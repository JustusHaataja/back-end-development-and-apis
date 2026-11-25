function getUpperCase(s) {
    return s.toUpperCase()
}

function getLowerCase(s) {
    return s.toLowerCase()
}

function getSentenceCase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function getProperCase(s) {
    return s.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

module.exports = {
    getUpperCase,
    getLowerCase,
    getSentenceCase,
    getProperCase
}