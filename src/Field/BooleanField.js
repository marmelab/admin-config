import ChoiceField from "./ChoiceField";

class BooleanField extends ChoiceField {
    constructor(name) {
        super(name);
        this._type = "boolean";
        this._choices = [
            { value: null, label: 'undefined' },
            { value: true, label: 'true' },
            { value: false, label: 'false' }
        ];
        this._filterChoices = [
            { value: true, label: 'true' },
            { value: false, label: 'false' }
        ];
    }

    filterChoices(filterChoices) {
        if (!arguments.length) return this._filterChoices;
        this._filterChoices = filterChoices;

        return this;
    }
}

export default BooleanField;
