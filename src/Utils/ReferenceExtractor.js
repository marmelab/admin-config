import ReferencedListField from '../Field/ReferencedListField';
import ReferenceField from '../Field/ReferenceField';

export default {

    getReferencedLists(fields) {
        return this.indexByName(fields.filter(f => f instanceof ReferencedListField));
    },
    getReferences(fields, withRemoteComplete, optimized = null) {
        let references = fields.filter( f => (f instanceof ReferenceField) && !(f instanceof ReferencedListField));
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
