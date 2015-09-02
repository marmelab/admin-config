'use strict';

import Field from './Field';

class FieldSet extends Field {
    constructor(name) {
        super(name);
        this._type = 'fieldset';
        this._rows = [];
        this._cssClasses = ['grid-form'];
        this._span = null;
    }

    getReferences() {
        let out = [];
        for (var i in this._rows) {
            for (var j in this._rows[i]._fields) {
                var f = this._rows[i]._fields[j];
                if (f.type() === 'reference' || f.type() === 'reference_many') {
                    out.push(f);
                }
            }
        }
        return out;
    }

    isFieldset() {
        return true;
    }

    span() {
        if (!arguments.length) {
            return this._span || this._rows.length || 1;
        }

        this._span = arguments[0];
        return this;
    }

    rows(rows) {
        if (!arguments.length) {
            return this._rows;
        }

        for (var i in rows) {
            if (rows[i].type() !== 'row') {
                throw "fieldset expects rows to be row type";
            }
        }

        this._rows = rows;
        return this;
    }
}

export default FieldSet;
