import View from './View';

class BatchDeleteView extends View {

    constructor(name) {
        super(name);

        this._type = 'BatchDeleteView';
        this._enabled = true;
        this._singleApiCall = false;
    }

    singleApiCall(singleApiCall) {
        if (!arguments.length) return this._singleApiCall;
        this._singleApiCall = singleApiCall;
        return this;
    }

    hasSingleApiCall() {
        return typeof this._singleApiCall === 'function';
    }

    getSingleApiCall(identifiers) {
        return this.hasSingleApiCall() ? this._singleApiCall(identifiers) : this._singleApiCall;
    }
}

export default BatchDeleteView;
