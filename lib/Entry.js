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
    static createFromRest(restEntry, fields, entityName, identifierName) {
        if (!restEntry || Object.keys(restEntry).length == 0) {
            return Entry.createForFields(fields, entityName);
        }

        let values = cloneAndFlatten(restEntry);

        fields.forEach(field => {
            let fieldName = field.name();
            if (fieldName in values) {
                values[fieldName] = field.getMappedValue(values[fieldName], values);
            }
        });

        return new Entry(entityName, values, values[identifierName]);
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
                restEntry[fieldName] = field.getTransformedValue(restEntry[fieldName])
            }
        });

        return cloneAndNest(restEntry);
    }

}

export default Entry;
