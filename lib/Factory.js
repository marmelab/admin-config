import Application from "./Application";
import Entity from "./Entity/Entity";
import DataStore from "./DataStore/DataStore";
import PromisesResolver from "./Utils/PromisesResolver";

import ReadQueries from "./Queries/ReadQueries";
import WriteQueries from "./Queries/WriteQueries";

import Field from "./Field/Field";
import BooleanField from "./Field/BooleanField";
import ChoiceField from "./Field/ChoiceField";
import ChoicesField from "./Field/ChoicesField";
import DateField from "./Field/DateField";
import DateTimeField from "./Field/DateTimeField";
import EmailField from "./Field/EmailField";
import FloatField from "./Field/FloatField.js";
import FileField from "./Field/FileField";
import JsonField from "./Field/JsonField";
import NumberField from "./Field/NumberField";
import PasswordField from "./Field/PasswordField";
import ReferenceField from "./Field/ReferenceField";
import ReferencedListField from "./Field/ReferencedListField";
import ReferenceManyField from "./Field/ReferenceManyField";
import TemplateField from "./Field/TemplateField";
import TextField from "./Field/TextField";
import WysiwygField from "./Field/WysiwygField";
import FieldSet from "./Field/FieldSet";
import RowField from "./Field/RowField";

import Menu from './Menu/Menu';
import Collection from './Collection';
import Dashboard from './Dashboard';
import Entry from './Entry';

class Factory {
    constructor() {
        this._fieldTypes = [];
        this._init();
    }

    application(name, baseApiUrl) {
        return new Application(name, baseApiUrl);
    }

    entity(name) {
        return new Entity(name);
    }

    field(name, type) {
        type = type || 'string';

        if (!(type in this._fieldTypes)) {
            throw new Error(`Unknown field type "${type}".`);
        }

        return new this._fieldTypes[type](name);
    }

    registerFieldType(name, constructor) {
        this._fieldTypes[name] = constructor;
    }

    getFieldConstructor(name) {
        return this._fieldTypes[name];
    }

    menu(entity) {
        let menu = new Menu();
        if (entity) {
            menu.populateFromEntity(entity);
        }
        return menu;
    }

    dashboard() {
        return new Dashboard();
    }

    collection(entity) {
        let collection = new Collection();
        if (entity) {
            collection.setEntity(entity);
        }
        return collection;
    }

    getEntryConstructor() {
        return Entry;
    }

    getDataStore() {
        return new DataStore();
    }

    getReadQueries(RestWrapper, PromisesResolver, Application) {
        return new ReadQueries(RestWrapper, PromisesResolver, Application);
    }

    getWriteQueries(RestWrapper, PromisesResolver, Application) {
        return new WriteQueries(RestWrapper, PromisesResolver, Application);
    }

    getPromisesResolver() {
        return PromisesResolver;
    }

    _init() {
        this.registerFieldType('boolean', BooleanField);
        this.registerFieldType('choice', ChoiceField);
        this.registerFieldType('choices', ChoicesField);
        this.registerFieldType('date', DateField);
        this.registerFieldType('datetime', DateTimeField);
        this.registerFieldType('email', EmailField);
        this.registerFieldType('float', FloatField);
        this.registerFieldType('string', Field);
        this.registerFieldType('file', FileField);
        this.registerFieldType('json', JsonField);
        this.registerFieldType('number', NumberField);
        this.registerFieldType('password', PasswordField);
        this.registerFieldType('reference', ReferenceField);
        this.registerFieldType('reference_many', ReferenceManyField);
        this.registerFieldType('referenced_list', ReferencedListField);
        this.registerFieldType('template', TemplateField);
        this.registerFieldType('text', TextField);
        this.registerFieldType('wysiwyg', WysiwygField);
        this.registerFieldType('fieldset', FieldSet);
        this.registerFieldType('row', RowField);
    }
}

export default Factory;
