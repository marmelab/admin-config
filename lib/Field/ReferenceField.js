import Field from "./Field";

class ReferenceField extends Field {
    constructor(name) {
        super(name);
        this._type = 'reference';
        this._targetEntity = null;
        this._targetField = null;
        this._perPage = 30;
        this._permanentFilters = null;
        this._sortField = null;
        this._sortDir = null;
        this._singleApiCall = false;
        this._detailLink = true;
        this._remoteComplete = false;
        this._remoteCompleteOptions= {
            refreshDelay: 500
        };
    }

    perPage(perPage) {
        if (!arguments.length) return this._perPage;
        this._perPage = perPage;
        return this;
    }

    datagridName() {
        return this._targetEntity.name() + '_ListView';
    }

    targetEntity(entity) {
        if (!arguments.length) {
            return this._targetEntity;
        }
        this._targetEntity = entity;

        return this;
    }

    targetField(field) {
        if (!arguments.length) return this._targetField;
        this._targetField = field;

        return this;
    }

    /**
     * Define permanent filters to be added to the REST API calls
     *
     *     nga.field('post_id', 'reference').permanentFilters({
     *        published: true
     *     });
     *     // related API call will be /posts/:id?published=true
     *     // if the permanent filter depends on the current query string, use a function
     *     nga.field('post_id', 'reference').permanentFilters(function(search) {
     *        return { published: true }
     *     });
     *
     * @param {Object|Function} filters list of filters to apply to the call
     */
    permanentFilters(filters) {
        if (!arguments.length) {
            return this._permanentFilters;
        }

        this._permanentFilters = filters;

        return this;
    }

    /**
     * @deprecated use permanentFilters() unstead
     */
    filters(filters) {
        console.warn('ReferenceField.filters() is deprecated, please use ReferenceField.permanentFilters() instead');
        return this.permanentFilters(filters);
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

    getIdentifierValues(rawValues) {
        let results = {};
        let identifierName = this._name;
        for (let i = 0, l = rawValues.length ; i < l ; i++) {
            let identifier = rawValues[i][identifierName];
            if (!identifier) {
                continue;
            }

            if (identifier instanceof Array) {
                for (let j in identifier) {
                    results[identifier[j]] = true;
                }
                continue;
            }

            results[identifier] = true;
        }

        return Object.keys(results);
    }

    getSortFieldName() {
        if (!this.sortField()) {
            return null;
        }

        return this._targetEntity.name() + '_ListView.' + this.sortField();
    }

    remoteComplete(remoteComplete, options) {
        if (!arguments.length) return this._remoteComplete;
        this._remoteComplete = remoteComplete;
        this._remoteCompleteOptions = options;
        return this;
    }

    remoteCompleteOptions(options) {
        if (!arguments.length) return this._remoteCompleteOptions;
        this._remoteCompleteOptions = options;
        return this;
    }
}

export default ReferenceField;
