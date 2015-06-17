import ListView from './View/ListView';

class Collection extends ListView {
    constructor(name) {
        super(name);
        this._type = 'collection';
    }
}

export default Collection;
