export default {
    order: function (input) {
        var results = [],
            objectKey;

        for (objectKey in input) {
            if (!input.hasOwnProperty(objectKey)) continue;
            results.push(input[objectKey]);
        }

        return results.sort((e1, e2) => e1.order() - e2.order());
    }
};
