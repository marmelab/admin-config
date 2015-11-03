var assert = require('chai').assert;

import Application from "../../lib/Application";
import Entity from "../../lib/Entity/Entity";
import Field from "../../lib/Field/Field";
import Dashboard from "../../lib/Dashboard";

describe('Application', function() {
    describe('entity', function () {
        it('should store entity by name.', function () {
            var app = new Application(),
                entity = new Entity('myEntity');
            app.addEntity(entity);

            assert.equal(app.getEntity('myEntity').name(), 'myEntity');
            assert.equal(app.getEntity('myEntity').order(), 0);
            assert.equal(app.hasEntity('myEntity'), true);
        });

        it('should return all entity names.', function () {
            var app = new Application();
            app.addEntity(new Entity('myEntity1'));
            app.addEntity(new Entity('myEntity2'));

            assert.deepEqual(app.getEntityNames(), ['myEntity1', 'myEntity2']);
        });
    });

    describe('getRouteFor', function() {
        it('should return entity name by default', function() {
            var application = new Application();
            var entity = new Entity('posts');
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('posts', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('posts/12', application.getRouteFor(entity, view.getUrl(12), view.type, 12, view.identifier()));
        });

        it('should work for zero indentifier', function() {
            var application = new Application();
            var entity = new Entity('posts');
            application.addEntity(entity);
            assert.equal('posts/0', application.getRouteFor(entity, null, null, 0, null));
        });

        it('should use the application baseApiUrl when provided', function() {
            var application = new Application();
            application.baseApiUrl('/foo/');
            var entity = new Entity('posts');
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('/foo/posts', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('/foo/posts/12', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should use the entity baseApiUrl when provided', function() {
            var application = new Application();
            var entity = new Entity('posts');
            entity.baseApiUrl('/bar/');
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('/bar/posts', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('/bar/posts/12', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should use the entity baseApiUrl when both the application and entity baseApiUrl are provided', function() {
            var application = new Application();
            application.baseApiUrl('/foo/');
            var entity = new Entity('posts');
            entity.baseApiUrl('/bar/');
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('/bar/posts', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('/bar/posts/12', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should use the entity url string when provided', function() {
            var application = new Application();
            var entity = new Entity('posts');
            entity.url('/bar/baz');
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('/bar/baz', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('/bar/baz', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should use the entity url function when provided', function() {
            var application = new Application();
            var entity = new Entity('posts');
            entity.url(function(entityName, viewType, identifierValue) {
                return '/bar/baz' + (identifierValue ? ('/' + identifierValue * 2) : '');
            });
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('/bar/baz', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('/bar/baz/24', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should use both the baseApiUrl and the entity url if the entity url is relative', function() {
            var application = new Application();
            application.baseApiUrl('/foo/');
            var entity = new Entity('posts');
            entity.url(function(entityName, viewType, identifierValue) {
                return 'bar/baz' + (identifierValue ? ('/' + identifierValue) : '');
            });
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('/foo/bar/baz', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('/foo/bar/baz/12', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should use only the entity url if the entity url is absolute', function() {
            var application = new Application();
            application.baseApiUrl('/foo/');
            var entity = new Entity('posts');
            entity.url(function(entityName, viewType, identifierValue) {
                return 'http://bar/baz' + (identifierValue ? ('/' + identifierValue) : '');
            });
            application.addEntity(entity);
            var view = entity.listView();
            assert.equal('http://bar/baz', application.getRouteFor(entity, view.getUrl(), view.type));
            assert.equal('http://bar/baz/12', application.getRouteFor(entity, view.getUrl(12), view.type, 12));
        });

        it('should return the url specified in a view', function () {
            var app = new Application(),
                entity1 = new Entity('myEntity1'),
                view = entity1.dashboardView();

            view.url('http://localhost/dashboard');
            app.addEntity(entity1);

            assert.equal(app.getRouteFor(entity1, view.getUrl(), view.type), 'http://localhost/dashboard');
        });

        it('should not consider protocol relative URL as a relative path', function () {
            var app = new Application(),
                entity1 = new Entity('myEntity1'),
                view = entity1.dashboardView();

            view.url('//localhost/dashboard');
            app.addEntity(entity1);

            assert.equal(app.getRouteFor(entity1, view.getUrl(), view.type), '//localhost/dashboard');
        });

        it('should return the url specified in the entity when the URL is not specified in the view', function () {
            var app = new Application(),
                entity1 = new Entity('comments'),
                view = entity1.dashboardView();

            entity1.baseApiUrl('http://api.com/');
            app.addEntity(entity1);

            assert.equal(app.getRouteFor(entity1, view.getUrl(), view.type), 'http://api.com/comments');
        });

        it('should return the url specified in the entity when the app also define a base URL', function () {
            var app = new Application(),
                entity1 = new Entity('comments'),
                view = entity1.dashboardView();

            entity1.baseApiUrl('//api.com/');
            app.baseApiUrl('http://api-entity.com/');
            app.addEntity(entity1);

            assert.equal(app.getRouteFor(entity1, view.getUrl(), view.type), '//api.com/comments');
        });

        it('should return the url specified in the app when the URL is not specified in the view nor in the entity', function () {
            var app = new Application(),
                entity1 = new Entity('comments'),
                view = entity1.dashboardView();

            app.baseApiUrl('https://elastic.local/');
            app.addEntity(entity1);

            assert.equal(app.getRouteFor(entity1, view.getUrl(), view.type), 'https://elastic.local/comments');
        });

        it('should call url() defined in the view if it\'s a function', function () {
            var app = new Application(),
                entity1 = new Entity('comments'),
                view = entity1.editionView();

            app.baseApiUrl('http://api.local');

            view.url(function (entityId) {
                return '/post/:' + entityId;
            });

            assert.equal(app.getRouteFor(entity1, view.getUrl(1), view.type, 1, view.identifier()), 'http://api.local/post/:1');
        });

        it('should call url() defined in the entity if it\'s a function', function () {
            var app = new Application(),
                entity1 = new Entity('comments'),
                view = entity1.editionView();

            app.baseApiUrl('http://api.local');

            entity1.url(function (entityName, viewType, identifierValue) {
                return '/' + entityName + '_' + viewType + '/:' + identifierValue;
            });

            assert.equal(app.getRouteFor(entity1, view.getUrl(1), view.type, 1, view.identifier()), 'http://api.local/comments_EditView/:1');
        });

        it('should not prepend baseApiUrl when the URL begins with http', function () {
            var app = new Application(),
                entity1 = new Entity('comments'),
                view = entity1.editionView();

            app.baseApiUrl('http://api.local');

            entity1.url('http://mock.local/entity');

            assert.equal(app.getRouteFor(entity1, view.getUrl(1), view.type, 1, view.identifier()), 'http://mock.local/entity');
        });
    });

    describe('getViewsOfType', () => {
        it('should return empty array if no entity set', () => {
            let application = new Application();
            assert.equal(0, application.getViewsOfType('dashboard').length);
        });

        it('should return only views of type', () => {
            let application = new Application(),
                post = new Entity('post'),
                comment = new Entity('comment');

            post.views["ShowView"].enable();
            comment.views["ShowView"].enable();

            application
                .addEntity(post)
                .addEntity(comment);

            let views = application.getViewsOfType('ShowView');

            assert.equal(2, views.length);

            assert.equal('post', views[0].entity.name());
            assert.equal('ShowView', views[0].type);

            assert.equal('comment', views[1].entity.name());
            assert.equal('ShowView', views[1].type);
        });

        it('should return only enabled views of type', () => {
            let application = new Application();
            let comment = new Entity('comment');
            let post = new Entity('post');

            comment.views.DashboardView.disable();
            post.views.DashboardView.enable();

            application
                .addEntity(post)
                .addEntity(comment);

            let views = application.getViewsOfType('DashboardView');

            assert.equal(1, views.length);
            assert.equal('post', views[0].entity.name());
        });

        it('should return ordered views of type', function() {
            let application = new Application();
            let [post, comment, tag] = [new Entity('post'), new Entity('comment'), new Entity('tag')];

            post.views["DashboardView"].enable();
            comment.views["DashboardView"].enable();
            tag.views["DashboardView"].enable();

            post.views.DashboardView.order(2);
            comment.views.DashboardView.order(1);
            tag.views.DashboardView.order(3);

            application
                .addEntity(post)
                .addEntity(comment)
                .addEntity(tag);

            let views = application.getViewsOfType('DashboardView');

            assert.equal(3, views.length);

            assert.equal('comment', views[0].entity.name());
            assert.equal('post', views[1].entity.name());
            assert.equal('tag', views[2].entity.name());
        });
    });

    describe('layout', function() {
        it('using function without argument should be as getter', function() {
            var application = new Application();
            application.layout = "New layout";

            assert.equal("New layout", application.layout);
        })
    });

    describe('buildMenuFromEntities', () => {
        it('should create a menu based on the entity list', () => {
            let application = new Application(),
                comment = new Entity('comment'),
                post = new Entity('post');

            comment.views.ListView.enable();
            post.views.ListView.enable();

            application
                .addEntity(post)
                .addEntity(comment);

            let menu = application.buildMenuFromEntities();
            assert.equal(2, menu.children().length);
            let [menu1, menu2] = menu.children();
            assert.equal('Post', menu1.title());
            assert.equal('Comment', menu2.title());
        });
        it('should use the menuView order when provided', () => {
            let application = new Application();
            let [e1, e2, e3] = [new Entity('e1'), new Entity('e2'), new Entity('e3')];

            e1.menuView().order(2);
            e2.menuView().order(1);
            e3.menuView().order(3);

            e1.views.ListView.enable();
            e2.views.ListView.enable();
            e3.views.ListView.enable();

            application
                .addEntity(e1)
                .addEntity(e2)
                .addEntity(e3);
            let menu = application.buildMenuFromEntities();
            let [menu1, menu2, menu3] = menu.children();
            assert.equal('E2', menu1.title());
            assert.equal('E1', menu2.title());
            assert.equal('E3', menu3.title());
        });
    });

    describe('dashboard()', () => {
        it('should return an empty dashboard by default', () => {
            let dashboard = new Application().dashboard();
            assert.deepEqual(dashboard.collections(), {});
        });

        it('should serve as a setter', () => {
            let dashboard = new Dashboard();
            const collection = { IAmAFakeCollection: true, name: () => 'foo' };
            dashboard.addCollection(collection)
            let application = new Application();
            application.dashboard(dashboard);
            assert.deepEqual(application.dashboard().collections(), { foo: collection });
        });
    });

    describe('buildDashboardFromEntities()', () => {
        it('should create a dashboard based on the entity dashboard views', () => {
            let application = new Application(),
                comment = new Entity('comment'),
                post = new Entity('post'),
                fields = [
                    new Field('field1'),
                    new Field('field2')
                ];

            comment.dashboardView().fields(fields);
            post.listView().fields(fields); // should be ignored

            application
                .addEntity(post)
                .addEntity(comment);

            let dashboard = application.buildDashboardFromEntities();
            assert.property(dashboard.collections(), 'comment');
            assert.notProperty(dashboard.collections(), 'post');
            let commentCollection = dashboard.collections().comment;
            assert.deepEqual(commentCollection.fields(), fields);
        });
        it('should create a dashboard based on the entity list views if no dashboard views', () => {
            let application = new Application(),
                comment = new Entity('comment'),
                post = new Entity('post'),
                fields = [
                    new Field('field1'),
                    new Field('field2'),
                    new Field('field3'),
                    new Field('field4')
                ];

            comment.listView().fields(fields);

            application
                .addEntity(post)
                .addEntity(comment);

            let dashboard = application.buildDashboardFromEntities();
            assert.property(dashboard.collections(), 'comment');
            assert.notProperty(dashboard.collections(), 'post');
            let commentCollection = dashboard.collections().comment;
            assert.deepEqual(commentCollection.fields(), fields.filter((el, i) => i < 3));
        });
    });

    describe('getErrorMessageFor', function () {
        it('should return the global message with a simple string as body', function () {
            var app = new Application(),
                entity = new Entity(),
                response = {
                    status: 500,
                    data: 'myBody'
                };

            app.addEntity(entity);

            assert.equal(app.getErrorMessageFor(entity.creationView(), response), 'Oops, an error occured : (code: 500) myBody');
        });

        it('should return the global message with an object as body', function () {
            var app = new Application(),
                entity = new Entity(),
                response = {
                    status: 500,
                    data: {
                        error: 'Internal error'
                    }
                };

            app.addEntity(entity);

            assert.equal(app.getErrorMessageFor(entity.listView(), response), 'Oops, an error occured : (code: 500) {"error":"Internal error"}');
        });

        it('should return the error message defined globally', function () {
            var app = new Application(),
                entity = new Entity(),
                response = {
                    status: 500
                };

            app.errorMessage(function (response) {
                return 'Global error: ' + response.status;
            });

            app.addEntity(entity);

            assert.equal(app.getErrorMessageFor(entity.listView(), response), 'Global error: 500');
        });

        it('should return the message defined by the entity', function () {
            var app = new Application(),
                entity = new Entity(),
                response = {
                    status: 500,
                    data: {
                        error: 'Internal error'
                    }
                };

            entity.errorMessage(function (response) {
                return 'error: ' + response.status;
            });

            app.addEntity(entity);

            assert.equal(app.getErrorMessageFor(entity.listView(), response), 'error: 500');
        });

        it('should return the message defined by the view', function () {
            var app = new Application(),
                entity = new Entity(),
                response = {
                    status: 500,
                    data: {
                        error: 'Internal error'
                    }
                };

            entity.listView().errorMessage(function (response) {
                return 'Error during listing: ' + response.status;
            });

            app.addEntity(entity);

            assert.equal(app.getErrorMessageFor(entity.listView(), response), 'Error during listing: 500');
        });
    });
});
