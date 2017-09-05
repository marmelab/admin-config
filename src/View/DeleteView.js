import View from './View';

class DeleteView extends View {
    constructor(name) {
        super(name);
        this._type = 'DeleteView';
        this._enabled = true;
        this._submitCreationSuccess = null;
        this._submitCreationError = null;
    }

    /**
     * Add a function to be executed after the delete succeeds.
     *
     * This is the ideal place to use the response to delete the entry, or
     * redirect to another view.
     *
     * If the function returns false, the default execution workflow is stopped.
     * This means that the function must provide a custom workflow.
     *
     * If the function throws an exception, the onSubmitError callback will
     * execute.
     *
     * The syntax depends on the framework calling the function.
     *
     * With ng-admin, the function can be an angular injectable, listing
     * required dependencies in an array. Among other, the function can receive
     * the following services:
     *  - $event: the form submission event
     *  - entry: the current Entry instance
     *  - entity: the current entity
     *  - form: the form object (for form validation and errors)
     *  - progression: the controller for the loading indicator
     *  - notification: the controller for top notifications
     *
     * The function can be asynchronous, in which case it should return
     * a Promise.
     *
     * @example
     *
     *     post.deletionView().onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
     *         // stop the progress bar
     *         progression.done();
     *         // add a notification
     *         notification.log(`Element #${entry._identifierValue} successfully deleted.`, { addnCls: 'humane-flatty-success' });
     *         // redirect to the list view
     *         $state.go($state.get('list'), { entity: entity.name() });
     *         // cancel the default action (redirect to the edition view)
     *         return false;
     *      }])
     */
    onSubmitSuccess(onSubmitSuccess) {
        if (!arguments.length) return this._onSubmitSuccess;
        this._onSubmitSuccess = onSubmitSuccess;
        return this;
    }

    /**
     * Add a function to be executed after the delete request receives a failed
     * http response from the server.
     *
     * This is the ideal place to use the response to delete the entry, display
     * server-side validation error, or redirect to another view.
     *
     * If the function returns false, the default execution workflow is stopped.
     * This means that the function must provide a custom workflow.
     *
     * The syntax depends on the framework calling the function.
     *
     * With ng-admin, the function can be an angular injectable, listing
     * required dependencies in an array. Among other, the function can receive
     * the following services:
     *  - $event: the form submission event
     *  - error: the response from the server
     *  - errorMessage: the error message based on the response
     *  - entry: the current Entry instance
     *  - entity: the current entity
     *  - form: the form object (for form validation and errors)
     *  - progression: the controller for the loading indicator
     *  - notification: the controller for top notifications
     *
     * The function can be asynchronous, in which case it should return
     * a Promise.
     *
     * @example
     *
     *     post.deletionView().onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) {
     *         // stop the progress bar
     *         progression.done();
     *         // add a notification
     *         notification.log(`Failed to delete element.`, { addnCls: 'humane-flatty-error' });
     *         // cancel the default action (default error messages)
     *         return false;
     *     }]);
     */
    onSubmitError(onSubmitError) {
        if (!arguments.length) return this._onSubmitError;
        this._onSubmitError = onSubmitError;
        return this;
    }
}

export default DeleteView;
