var VineWhip = {};

(function(VineWhip){
    // Error handling

    VineWhip.UserException = function(message) {
        this.message = message;
        this.toString = function() {
            return this.message;
        };
    };

    VineWhip.ModelMismatch = new VineWhip.UserException('Model mismatch');
    VineWhip.NotImplemented = new VineWhip.UserException('Not implemented');

    VineWhip.assertType = function(obj, ctor) {
        if (!(obj && obj.constructor === ctor)) throw new VineWhip.UserException(obj + ' is not ' + (typeof ctor));
    };

    VineWhip.assertProperty = function(obj, prop) {
        if (!(obj.hasOwnProperty(prop))) throw new VineWhip.UserException(obj + ' is missing property ' + prop);
    };

    // Utilities

    VineWhip.objExtend = function(obj, ext) {
        for (key in ext) if (ext.hasOwnProperty(key)) obj[key] = ext[key];
    };



    VineWhip.Model = function(o) {
        // Defining model fields
        VineWhip.assertType(o, Object);

        // Create Model constructor
        Model = function(fields) {
            this._data = Object.create(Model.prototype._defaults);

            if (fields) VineWhip.objExtend(this._data, fields);
        };

        // Inherit Model methods
        Model.prototype = Object.create(VineWhip.Model.prototype);

        // Define model defaults
        Model.prototype._defaults = o.defaults || Object.prototype;

        Model.prototype._modelCtor = Model;

        return Model;
    };

    VineWhip.Model.prototype.set = function(fields) {
        VineWhip.assertType(fields, Object);        

        VineWhip.objExtend(this._data, fields);
    };

    VineWhip.Model.prototype.get = function(field) {
        return this._data[key];
    };



    VineWhip.View = function(o) {
        VineWhip.assertType(o, Object);
        VineWhip.assertProperty(o, 'modelType');
        VineWhip.assertProperty(o, 'template');        
    
        // Create View constructor
        View = function(model) {
            this.bind(model);
        };

        // Inherit view methods
        View.prototype = Object.create(VineWhip.View.prototype);

        // Have view remember Model type
        View.prototype._modelCtor = o.modelType;

        return View;
    };

    VineWhip.View.prototype.checkModelType = function(model) {
        if (!(model._modelCtor === this._modelCtor)) throw VineWhip.ModelMismatch;
    };

    VineWhip.View.prototype.bind = function(model) {
        this.checkModelType(model);        
        this.model = model;
    };

    VineWhip.View.prototype.render = function() {
        
    };

})(VineWhip);