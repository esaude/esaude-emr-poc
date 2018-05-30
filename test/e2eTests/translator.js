module.exports = {
    localize: function (key) {
        // TODO: load the right file depending on the selected locale
        const pt = require('./locale_pt.js')

        // TODO: what to do when the key does not exist in the locale file?
        return pt[key]
    },
};