import ListView from './ListView';

class DashboardView extends ListView {
    setEntity(entity) {
        this.entity = entity;
        if (!this._name) {
            this._name = entity.name();
        }
        return this;
    }
}

export default DashboardView;
