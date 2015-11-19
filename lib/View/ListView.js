import View from './View';
import orderElement from "../Utils/orderElement";

class ListView extends View {
    constructor(name) {
        super(name);

        this._type = 'ListView';
        this._perPage = 30;
        this._infinitePagination = false;
        this._listActions = [];
        this._batchActions = ['delete'];
        this._filters = [];
        this._permanentFilters = {};
        this._exportFields = null;
        this._entryCssClasses = null;

        this._sortField = 'id';
        this._sortDir = 'DESC';
    }

    perPage() {
        if (!arguments.length) { return this._perPage; }
        this._perPage = arguments[0];
        return this;
    }

    /** @deprecated Use perPage instead */
    limit() {
        if (!arguments.length) { return this.perPage(); }
        return this.perPage(arguments[0]);
    }

    sortField() {
        if (arguments.length) {
            this._sortField = arguments[0];
            return this;
        }

        return this._sortField;
    }

    sortDir() {
        if (arguments.length) {
            this._sortDir = arguments[0];
            return this;
        }

        return this._sortDir;
    }

    getSortFieldName() {
        return this.name() + '.' + this._sortField;
    }

    infinitePagination() {
        if (arguments.length) {
            this._infinitePagination = arguments[0];
            return this;
        }

        return this._infinitePagination;
    }

    actions(actions) {
        if (!arguments.length) {
            return this._actions;
        }

        this._actions = actions;

        return this;
    }

    exportFields(exportFields) {
        if (!arguments.length) {
            return this._exportFields;
        }

        this._exportFields = exportFields;

        return this;
    }

    batchActions(actions) {
        if (!arguments.length) {
            return this._batchActions;
        }

        this._batchActions = actions;

        return this;
    }

    /**
     * Define permanent filters to be added to the REST API calls
     *
     *     posts.listView().permanentFilters({
     *        published: true
     *     });
     *     // related API call will be /posts?published=true
     *
     * @param {Object} filters list of filters to apply to the call
     */
    permanentFilters(filters) {
        if (!arguments.length) {
            return this._permanentFilters;
        }

        this._permanentFilters = filters;

        return this;
    }

    /**
     * Define filters the user can add to the datagrid
     *
     *     posts.listView().filters([
     *       nga.field('title'),
     *       nga.field('age', 'number')
     *     ]);
     *
     * @param {Field[]} filters list of filters to add to the GUI
     */
    filters(filters) {
        if (!arguments.length) {
            return this._filters;
        }

        this._filters = orderElement.order(filters);

        return this;
    }

    getFilterReferences(withRemoteComplete) {
        let result = {};
        let lists = this._filters.filter(f => f.type() === 'reference');

        var filterFunction = null;
        if (withRemoteComplete === true) {
            filterFunction = f => f.remoteComplete();
        } else if (withRemoteComplete === false) {
            filterFunction = f => !f.remoteComplete();
        }

        if (filterFunction !== null) {
            lists = lists.filter(filterFunction);
        }

        for (let i = 0, c = lists.length ; i < c ; i++) {
            let list = lists[i];
            result[list.name()] = list;
        }

        return result;
    }

    listActions(actions) {
        if (!arguments.length) {
            return this._listActions;
        }

        this._listActions = actions;

        return this;
    }

    entryCssClasses(classes) {
        if (!arguments.length) {
            return this._entryCssClasses;
        }

        this._entryCssClasses = classes;

        return this;
    }

    getEntryCssClasses(entry) {
        if (!this._entryCssClasses) {
            return '';
        }

        if (this._entryCssClasses.constructor === Array) {
            return this._entryCssClasses.join(' ');
        }

        if (typeof(this._entryCssClasses) === 'function') {
            return this._entryCssClasses(entry);
        }

        return this._entryCssClasses;
    }
}

export default ListView;
