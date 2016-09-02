import ListView from './View/ListView';

class Collection extends ListView {

    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name();
        }
        return this;
    }
}

export default Collection;
