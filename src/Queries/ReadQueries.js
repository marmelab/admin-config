import Queries from './Queries';
import ReferenceExtractor from '../Utils/ReferenceExtractor';

class ReadQueries extends Queries {

    /**
     * Get one entity
     *
     * @param {Entity}   entity
     * @param {String}   viewType
     * @param {mixed}    identifierValue
     * @param {String}   identifierName
     * @param {String}   url
     *
     * @returns {promise} (list of fields (with their values if set) & the entity name, label & id-
     */
    getOne(entity, viewType, identifierValue, identifierName, url) {
        return this._restWrapper
            .getOne(entity.name(), this._application.getRouteFor(entity, url, viewType, identifierValue, identifierName), entity.retrieveMethod());
    }

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {ListView} view                the view associated to the entity
     * @param {Number}   page                the page number
     * @param {Object}   filterValues        searchQuery to filter elements
     * @param {String}   sortField           the field to be sorted ex: entity.fieldName
     * @param {String}   sortDir             the direction of the sort
     *
     * @returns {promise} the entity config & the list of objects
     */
    getAll(view, page, filterValues, sortField, sortDir) {
        page = page || 1;
        filterValues = filterValues || {};
        let url = view.getUrl();

        if (sortField && sortField.split('.')[0] === view.name()) {
            sortField = sortField;
            sortDir = sortDir;
        } else {
            sortField = view.getSortFieldName();
            sortDir = view.sortDir();
        }

        let allFilterValues = {};
        const permanentFilters = view.permanentFilters();
        Object.keys(filterValues).forEach(key => {
            allFilterValues[key] = filterValues[key];
        });
        Object.keys(permanentFilters).forEach(key => {
            allFilterValues[key] = permanentFilters[key];
        });

        return this.getRawValues(view.entity, view.name(), view.type, page, view.perPage(), allFilterValues, view.filters(), sortField, sortDir, url)
            .then((values) => {
                return {
                    data: values.data,
                    totalItems: values.totalCount || values.headers('X-Total-Count') || values.data.length
                };
            });
    }

    /**
     * Return the list of all object of entityName type
     * Get all the object from the API
     *
     * @param {Entity}   entity
     * @param {String}   viewName
     * @param {String}   viewType
     * @param {Number}   page
     * @param {Number}   perPage
     * @param {Object}   filterValues
     * @param {Object}   filterFields
     * @param {String}   sortField
     * @param {String}   sortDir
     * @param {String}   url
     *
     * @returns {promise} the entity config & the list of objects
     */
    getRawValues(entity, viewName, viewType, page, perPage, filterValues, filterFields, sortField, sortDir, url) {
        let params = {};

        // Compute pagination
        if (page !== -1) {
            params._page = (typeof (page) === 'undefined') ? 1 : parseInt(page, 10);
            params._perPage = perPage;
        }

        // Compute sorting
        if (sortField && sortField.split('.')[0] === viewName) {
            params._sortField = sortField.substr(sortField.indexOf('.') + 1);
            params._sortDir = sortDir;
        }

        // Compute filtering
        if (filterValues && Object.keys(filterValues).length !== 0) {
            params._filters = {};
            let filterName, mappedValue;
            for (filterName in filterValues) {
                if (filterFields.hasOwnProperty(filterName) && filterFields[filterName].hasMaps()) {
                    mappedValue = filterFields[filterName].getMappedValue(filterValues[filterName]);
                    Object.keys(mappedValue).forEach(key => {
                        params._filters[key] = mappedValue[key];
                    })
                    continue;
                }

                // It's weird to not map, but why not.
                params._filters[filterName] = filterValues[filterName];
            }
        }

        // Get grid data
        return this._restWrapper
            .getList(params, entity.name(), this._application.getRouteFor(entity, url, viewType), entity.retrieveMethod());
    }

    getReferenceData(references, rawValues) {
        var nonOptimizedReferencedData = this.getFilteredReferenceData(ReferenceExtractor.getNonOptimizedReferences(references), rawValues);
        var optimizedReferencedData = this.getOptimizedReferenceData(ReferenceExtractor.getOptimizedReferences(references), rawValues);
        return Promise.all([nonOptimizedReferencedData, optimizedReferencedData])
            .then((results) => {
                let data = {};
                let name;
                for (name in results[0]) {
                    data[name] = results[0][name];
                }
                for (name in results[1]) {
                    data[name] = results[1][name];
                }
                return data;
            })
    }

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     * by calling the API for each entries
     *
     * @param {ReferenceField} references A hash of Reference and ReferenceMany objects
     * @param {Array} rawValues
     *
     * @returns {Promise}
     */
    getFilteredReferenceData(references, rawValues) {
        if (!references || !Object.keys(references).length) {
            return this._promisesResolver.empty({});
        }

        let getOne = this.getOne.bind(this),
            calls = [];

        for (let i in references) {
            let reference = references[i],
                targetEntity = reference.targetEntity(),
                identifiers = reference.getIdentifierValues(rawValues);

            for (let k in identifiers) {
                calls.push(getOne(targetEntity, 'listView', identifiers[k], reference.name()));
            }
        }

        return this.fillFilteredReferencedData(calls, references, rawValues);
    }

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     * by calling the API once
     *
     * @param {[ReferenceField]} references A hash of Reference and ReferenceMany objects
     * @param {Array} rawValues
     *
     * @returns {Promise}
     */
    getOptimizedReferenceData(references, rawValues) {
        if (!references || !Object.keys(references).length) {
            return this._promisesResolver.empty({});
        }

        let getRawValues = this.getRawValues.bind(this),
            calls = [];

        for (let i in references) {
            let reference = references[i],
                targetEntity = reference.targetEntity(),
                identifiers = reference.getIdentifierValues(rawValues);

            // Check if we should retrieve values with 1 or multiple requests
            let singleCallFilters = reference.getSingleApiCall(identifiers);
            calls.push(getRawValues(targetEntity, targetEntity.name() + '_ListView', 'listView', 1, reference.perPage(), singleCallFilters, {}, reference.sortField(), reference.sortDir()));
        }

        return this.fillOptimizedReferencedData(calls, references);
    }

    /**
     * Returns all References for an entity with associated values [{targetEntity.identifier: targetLabel}, ...]
     * without filters on an entity
     *
     * @param {[ReferenceField]} references A hash of Reference and ReferenceMany objects
     *
     * @returns {Promise}
     */
    getAllReferencedData(references, search) {
        if (!references || !Object.keys(references).length) {
            return this._promisesResolver.empty({});
        }

        let calls = [],
            getRawValues = this.getRawValues.bind(this);

        for (let i in references) {
            let reference = references[i];
            let targetEntity = reference.targetEntity();

            const permanentFilters = reference.permanentFilters();
            let filterValues = permanentFilters || {};

            if (typeof(permanentFilters) === 'function') {
                console.warn('Reference.permanentFilters() called with a function is deprecated. Use the searchQuery option for remoteComplete() instead');
                filterValues = permanentFilters(search);
            }

            if (search) {
                // remote complete situation
                let options = reference.remoteCompleteOptions();
                if (options.searchQuery) {
                    let filterValuesFromRemoteComplete = options.searchQuery(search);
                    Object.keys(filterValuesFromRemoteComplete).forEach(key => {
                        filterValues[key] = filterValuesFromRemoteComplete[key];
                    })
                } else {
                    // by default, filter the list by the referenceField name
                    filterValues[reference.targetField().name()] = search;
                }
            }

            let filterFields = {};
            filterFields[reference.name()] = reference;

            calls.push(getRawValues(
                targetEntity,
                targetEntity.name() + '_ListView',
                'listView',
                1,
                reference.perPage(),
                filterValues,
                filterFields,
                reference.getSortFieldName(),
                reference.sortDir()
            ));

        }

        return this.fillOptimizedReferencedData(calls, references);
    }

    /**
     * Fill all reference entries to return [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {[Promise]} apiCalls
     * @param {[Reference]} references
     * @returns {Promise}
     */
    fillOptimizedReferencedData(apiCalls, references) {
        return this._promisesResolver.allEvenFailed(apiCalls)
            .then((responses) => {
                if (responses.length === 0) {
                    return {};
                }

                let referencedData = {},
                    i = 0;

                for (let j in references) {
                    let reference = references[j],
                        response = responses[i++];

                    // Retrieve entries depending on 1 or many request was done
                    if (response.status == 'error') {
                        // the response failed
                        continue;
                    }

                    referencedData[reference.name()] = response.result.data;
                }

                return referencedData;
            });
    }

    /**
     * Fill all reference entries to return [{targetEntity.identifier: targetLabel}, ...]
     *
     * @param {[Promise]} apiCalls
     * @param {[Reference]} references
     * @param {[Object]} rawValues
     * @returns {Promise}
     */
    fillFilteredReferencedData(apiCalls, references, rawValues) {
        return this._promisesResolver.allEvenFailed(apiCalls)
            .then((responses) => {
                if (responses.length === 0) {
                    return {};
                }

                let referencedData = {},
                    response,
                    i = 0;

                for (let j in references) {
                    let data = [],
                        reference = references[j],
                        identifiers = reference.getIdentifierValues(rawValues);

                    for (let k in identifiers) {
                        response = responses[i++];
                        if (response.status == 'error') {
                            // one of the responses failed
                            continue;
                        }
                        data.push(response.result);
                    }

                    if (!data.length) {
                        continue;
                    }

                    referencedData[reference.name()] = data;
                }

                return referencedData;
            });
    }

    /**
     * Returns all ReferencedList for an entity for associated values [{targetEntity.identifier: [targetFields, ...]}}
     *
     * @param {View}   referencedLists
     * @param {String} sortField
     * @param {String} sortDir
     * @param {*} entityId
     *
     * @returns {promise}
     */
    getReferencedListData(referencedLists, sortField, sortDir, entityId) {
        let getRawValues = this.getRawValues.bind(this),
            calls = [];

        for (let i in referencedLists) {
            let referencedList = referencedLists[i],
                targetEntity = referencedList.targetEntity(),
                viewName = referencedList.datagridName(),
                currentSortField = referencedList.getSortFieldName(),
                currentSortDir = referencedList.sortDir(),
                filter = {};

            if (sortField && sortField.split('.')[0] === viewName) {
                currentSortField = sortField;
                currentSortDir = sortDir || 'ASC';
            }

            const permanentFilters = referencedList.permanentFilters() || {};
            Object.keys(permanentFilters).forEach(key => {
                filter[key] = permanentFilters[key];
            });
            filter[referencedList.targetReferenceField()] = entityId;

            calls.push(getRawValues(targetEntity, viewName, 'listView', 1, referencedList.perPage(), filter, {}, currentSortField, currentSortDir));
        }

        return this._promisesResolver.allEvenFailed(calls)
            .then((responses) => {
                let j = 0,
                    entries = {};

                for (let i in referencedLists) {
                    let response = responses[j++];
                    if (response.status == 'error') {
                        // If a response fail, skip it
                        continue;
                    }

                    entries[i] = response.result.data;
                }

                return entries;
            });
    }

    getRecordsByIds(entity, ids) {
        if (!ids || !ids.length) {
            return this._promisesResolver.empty();
        }

        let calls = ids.map(id => this.getOne(entity, 'listView', id, entity.identifier().name()));

        return this._promisesResolver.allEvenFailed(calls)
            .then(responses => responses.filter(r => r.status != 'error').map(r => r.result));
    }
}

export default ReadQueries;
