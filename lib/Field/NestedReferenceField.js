import ReferenceField from './ReferenceField';

class NestedReferenceField extends ReferenceField {
    constructor(name) {
        super(name);
        this._type = 'nested_reference';
        this._nestedField = null;
    }

    nestedField(nfield) {
        if (arguments.length === 0) {
            return this._nestedField;
        }
        this._nestedField = nfield;
        return this;
    }

    labelDisplay(entry) {
        var field = this.nestedField().name() + '.' + this.targetField().name();
        var out = entry.values[field];
        return out;
    }
}

export default NestedReferenceField;
