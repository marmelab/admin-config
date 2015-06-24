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
}

export default Entry;
