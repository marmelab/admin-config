
import buildPromise from "./mixins";

var PromisesResolver = {
    allEvenFailed: function() { return buildPromise([]); },
    empty: function() { return buildPromise(); }
};

export default PromisesResolver;
