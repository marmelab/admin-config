import View from './View';

class BatchDeleteView extends View {
    constructor(name) {
        super(name);

        this._type = 'BatchDeleteView';
        this._enabled = true;
    }
}

export default BatchDeleteView;
