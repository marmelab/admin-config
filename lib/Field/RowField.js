'use strict';

import Field from './Field';

class RowField extends Field {
    constructor(name) {
        super(name);
        this._type = 'row';
        this._span = null;
        this._fields = [];
    }

    span() {
        if (!arguments.length) {
            return this._span || this._fields.length || 1;
        }
        this._span = arguments[0];
        return this;
    }

    editCssSpanClass(field){
        if (field.attributes.editSpan) {
            return 'col-md-' + field.attributes().editSpan;
        }

        return this.cssSpanClass(field)
    }

    cssSpanClass(field) {
        if (field.attributes().span) {
            return 'col-md-' + field.attributes().span;
        }
        var span = this._span || this._fields.length;
        return 'col-md-' + (12/span);
    }

    fields() {
        if (!arguments.length) {
            return this._fields;
        }

        this._fields = arguments[0];
        for (var i in this._fields) {
            var field = this._fields[i];
            field.labelCssClasses('');
            if (!field.cssClasses()) {
                field.cssClasses('row-field');
            }
        }

        return this;
    }
}

export default RowField;
