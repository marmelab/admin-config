export default {
    order: function (input) {
        var results = [];

        for (let i of input) {
            results.push(i);
        }

        return results.sort((e1, e2) => e1.order() - e2.order());
    }
};
