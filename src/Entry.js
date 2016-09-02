import {clone, cloneAndFlatten, cloneAndNest} from './Utils/objectProperties';


class Entry {
    constructor(entityName, values, identifierValue) {
        this._entityName = entityName;
        this.values = values || {};
        this._identifierValue = identifierValue;
        this.listValues = {};
    }

    get entityName() {
        return this._entityName;
    }

    get identifierValue() {
        return this._identifierValue;
    }

    static createForFields(fields, entityName) {
        let entry = new Entry(entityName);
        fields.forEach(field => {
            entry.values[field.name()] = field.defaultValue();
        });
        return entry;

    }

    /**
     * Map a JS object from the REST API Response to an Entry
     *
     * @return {Entry}
     */
    static createFromRest(restEntry, fields = [], entityName = '', identifierName = 'id') {
        if (!restEntry || Object.keys(restEntry).length == 0) {
            return Entry.createForFields(fields, entityName);
        }
        const excludedFields = fields.filter(f => !f.flattenable()).map(f => f.name());

        let values = cloneAndFlatten(restEntry, excludedFields);

        fields.forEach(field => {
            let fieldName = field.name();
            values[fieldName] = field.getMappedValue(values[fieldName], values);
        });

        return new Entry(entityName, values, values[identifierName]);
    }

    /**
     * Map an array of JS objects from the REST API Response to an array of Entries
     *
     * @return {Array[Entry]}
     */
    static createArrayFromRest(restEntries, fields, entityName, identifierName) {
        return restEntries.map(e => Entry.createFromRest(e, fields, entityName, identifierName));
    }

    /**
     * Transform an Entry to a JS object for the REST API Request
     *
     * @return {Object}
     */
    transformToRest(fields) {

        let restEntry = clone(this.values);
        fields.forEach(field => {
            let fieldName = field.name();
            if (fieldName in restEntry) {
                restEntry[fieldName] = field.getTransformedValue(restEntry[fieldName], restEntry)
            }
        });

        return cloneAndNest(restEntry);
    }

}

export default Entry;
