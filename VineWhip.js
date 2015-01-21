var VineWhip = {};

(function(VineWhip){
    // Error handling

    VineWhip.UserException = function(message) {
        this.message = message;
        this.toString = function() {
            return this.message;
        };
    };

    VineWhip.ModelMismatch = VineWhip.UserException('Model mismatch');

    VineWhip.assertType = function(obj, ctor) {
        if (!(obj && obj.constructor === ctor)) throw VineWhip.UserException(obj + ' is not ' + (typeof ctor));
    };

    VineWhip.assertProperty = function(obj, prop) {
        if (!(obj.hasOwnProperty(prop))) throw VineWhip.UserException(obj + ' is missing property ' + prop);
    };

    // Utilities

    VineWhip.objExtend = function(obj, ext) {
        for (key in ext) if (ext.hasOwnProperty(key)) obj[key] = ext[key];
    };

    VineWhip.newUid = function(tag) {
        while (VineWhip.newUid.prototype.uidHashes.hasOwnProperty(uid = tag +  Math.floor(Math.random() * 1000000).toString()));
        VineWhip.newUid.prototype.uidHashes[uid] = true;
        return uid;
    };

    VineWhip.newUid.prototype.uidHashes = {};


    VineWhip.Model = function(o) {
        // Defining model fields
        VineWhip.assertType(o, Object);
        VineWhip.assertProperty(o, 'defaults');

        // Create Model constructor
        Model = function(fields) {
            this._data = Object.create(Model.prototype._defaults);

            if (fields) VineWhip.objExtend(this._data, fields);
        };

        // Inherit Model methods
        Model.prototype = Object.create(VineWhip.Model.prototype);

        // Define model defaults
        Model.prototype._defaults = o.defaults;

        // Give Model type a unique id
        Model.prototype._typeUid = VineWhip.newUid('Model');

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
        VineWhip.assertProperty(o, 'model');
        VineWhip.assertProperty(o, 'template');        
    
        // Create View constructor
        View = function(model) {
            this.checkModelType(model);
            this.model = model;
        };

        // Inherit view methods
        View.prototype = Object.create(VineWhip.View.prototype);

        View.prototype._modelTypeUid = o.model.constructor.prototype._typeUid;
    };

    VineWhip.View.prototype.checkModelType = function(model) {
        if (!(model._typeUid === this.constructor.prototype._modelTypeUid)) throw VineWhip.ModelMismatch;
    };

    VineWhip.View.prototype.bind = function(model) {
        this.model = model;
    };

    VineWhip.View.prototype.render = function() {
        
    };

})(VineWhip);