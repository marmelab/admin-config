export default {

    getReferencedLists(fields) {
        return this.indexByName(fields.filter(f => f.type() === 'referenced_list'));
    },
    getReferences(fields, withRemoteComplete, optimized = null) {
        var references = fields.filter(f => f.type() === 'reference' || f.type() === 'reference_many');
        let embed = fields.filter(f => f.type() === 'embedded_list')
        for (let i = 0, l = embed.length ; i < l ; i++) {
            let field = embed[i];
            references = references.concat(field.targetFields().filter(f => f.type() === 'reference' || f.type() === 'reference_many') );
        }

        if (withRemoteComplete === true) {
            references = references.filter(r => r.remoteComplete());
        } else if (withRemoteComplete === false) {
            references = references.filter(r => !r.remoteComplete());
        }
        if (optimized !== null) {
            references = references.filter(r => r.hasSingleApiCall() === optimized)
        }
        return this.indexByName(references);
    },
    getNonOptimizedReferences(fields, withRemoteComplete) {
        return this.getReferences(fields, withRemoteComplete, false);
    },
    getOptimizedReferences(fields, withRemoteComplete) {
        return this.getReferences(fields, withRemoteComplete, true);
    },
    indexByName(references) {
        return references.reduce((referencesByName, reference) => {
            referencesByName[reference.name()] = reference;
            return referencesByName;
        }, {});
    }
};
