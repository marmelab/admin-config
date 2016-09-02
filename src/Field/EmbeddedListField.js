import Field from "./Field";
import Entity from "../Entity/Entity";

/**
 * Map an embedded list in the entry
 *
 * @example
 *
 *     {
 *        id: 123,
 *        title: "hello, world",
 *        comments: [
 *          { date: "2015-09-30", author: "John Doe", body: "Lorem Ipsum" },
 *          { date: "2015-10-02", author: "Jane Doe", body: "Sic dolor amet" }
 *        ]
 *     }
 *
 *     let commentsField = new EmbeddedListField('comments')
 *        .targetFields([
 *          new DateField('date'),
 *          new StringField('author'),
 *          new StringField('body')
 *        ])
 */
class EmbeddedListField extends Field {
    constructor(name) {
        super(name);
        this._type = 'embedded_list';
        this._flattenable = false;
        this._targetEntity = new Entity(); // link to an empty entity by default
        this._targetFields = [];
        this._sortField = null;
        this._sortDir = null;
        this._permanentFilters = null;
        this._listActions = [];
    }

    /**
     * Optionally set the target Entity
     *
     * Useful if the embedded entries can be edited in standalone
     */
    targetEntity(entity) {
        if (!arguments.length) {
            return this._targetEntity;
        }
        this._targetEntity = entity;

        return this;
    }

    /**
     * List the fields to map in the embedded entries
     *
     * @example
     *
     *     embeddedListField.targetFields([
     *       new DateField('date'),
     *       new StringField('author'),
     *       new StringField('body')
     *     ])
     */
    targetFields(value) {
        if (!arguments.length) return this._targetFields;
        this._targetFields = value;

        return this;
    }

    /**
     * Name of the field used for sorting.
     *
     * @param string
     */
    sortField() {
        if (arguments.length) {
            this._sortField = arguments[0];
            return this;
        }

        return this._sortField ? this._sortField : this.targetEntity().identifier().name();
    }

    /**
     * Direction used for sorting.
     *
     * @param String either 'ASC' or 'DESC'
     */
    sortDir() {
        if (arguments.length) {
            this._sortDir = arguments[0];
            return this;
        }

        return this._sortDir;
    }

    listActions(actions) {
        if (!arguments.length) {
            return this._listActions;
        }

        this._listActions = actions;

        return this;
    }

    /**
     * Define permanent filters to be added to the REST API calls
     *
     *     nga.field('post_id', 'reference').permanentFilters({
     *        published: true
     *     });
     *     // related API call will be /posts/:id?published=true
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
}

export default EmbeddedListField;
