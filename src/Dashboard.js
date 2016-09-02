class Dashboard {
    constructor() {
        this._collections = {};
        this._template = null;
    }

    addCollection(collection) {
        this._collections[collection.name()] = collection;
        return this;
    }

    collections(collections) {
        if (arguments.length) {
            this._collections = collections;
            return this;
        }
        return this._collections;
    }

    hasCollections() {
        return Object.keys(this._collections).length > 0;
    }

    template(template) {
        if (arguments.length) {
            this._template = template;
            return this;
        }
        return this._template;        
    }
}

export default Dashboard;
