'use strict';

Bahmni.Common.Util.ArrayUtil = {
    chunk: (array, chunkSize) => {
        var chunks = [];
        for (var i = 0; i < array.length; i += chunkSize) chunks.push(array.slice(i, i + chunkSize));
        return chunks;
    },
};
