export default {

    getReferencedLists(fields) {
        return this.indexByName(fields.filter(f => f.type() === 'referenced_list'));
    },
    getReferences(fields, optimized = null) {
        let references = fields.filter(f => f.type() === 'reference' || f.type() === 'reference_many');
        if (optimized !== null) {
            references = references.filter(r => r.hasSingleApiCall() === optimized)
        }
        return this.indexByName(references);
    },
    getNonOptimizedReferences(fields) {
        return this.getReferences(fields, false);
    },
    getOptimizedReferences(fields) {
        return this.getReferences(fields, true);
    },
    indexByName(references) {
        return references.reduce((referencesByName, reference) => {
            referencesByName[reference.name()] = reference;
            return referencesByName;
        }, {});
    }
};
