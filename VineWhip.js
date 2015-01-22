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



    // Model factory

    VineWhip.Model = function(o) {
        VineWhip.assertType(o, Object);

        modelProps = ['defaults'];
        for (prop in modelProps) VineWhip.assertProperty(o, modelProps[prop]);

        // Create Model constructor
        Model = function(fields) {
            this._data = Object.create(Model.prototype._defaults);

            if (fields) VineWhip.objExtend(this._data, fields);
        };

        // Inherit Model methods
        Model.prototype = Object.create(VineWhip.Model._objProto);

        // Define model defaults
        Model.prototype._defaults = o.defaults || Object.prototype;

        Model.prototype._modelCtor = Model;

        // Set specific Model methods
        for (prop in o) {
            if (o.hasOwnProperty(prop) && !(o in modelProps)) {
                Model.prototype[prop] = o[prop];
            }
        };

        return Model;
    };

    // Model prototype

    VineWhip.Model._objProto = {};

    VineWhip.Model._objProto.set = function(fields) {
        VineWhip.assertType(fields, Object);        

        VineWhip.objExtend(this._data, fields);
    };

    VineWhip.Model._objProto.get = function(field) {
        return this._data[key];
    };



    // View factory

    VineWhip.View = function(o) {
        VineWhip.assertType(o, Object);

        viewProps = ['template'];
        for (prop in viewProps) VineWhip.assertProperty(o, viewProps[prop]);
    
        // Create View constructor
        View = function(model) {
            this.bind(model);
        };

        // Inherit View methods
        View.prototype = Object.create(VineWhip.View._objProto);

        // Have view remember Model type
        View.prototype._modelCtor = o.modelType || false;

        // Save View's template HTML
        View.prototype._templateHTML = o.template;

        // Set specific View methods
        for (prop in o) {
            if (o.hasOwnProperty(prop) && !(o in viewProps)) {
                View.prototype[prop] = o[prop];
            }
        };

        return View;
    };

    // View prototype

    VineWhip.View._objProto = {};

    VineWhip.View._objProto._checkModelType = function(model) {
        if (this._modelCtor && !(model._modelCtor === this._modelCtor)) throw VineWhip.ModelMismatch;
    };

    VineWhip.View._objProto.bind = function(model) {
        this._checkModelType(model);
        this.model = model;
    };

    VineWhip.View._objProto.render = function() {
        el = document.createElement('div');
        el.innerHTML = this._renderTemplateHTML(this.model, this._templateHTML);

        return el;
    };

    VineWhip.View._objProto._renderTemplateHTML = function(model, templateHTML) {
        lDelimiter = '{{';
        rDelimiter = '}}';

        valueRegExp = new RegExp(lDelimiter + '\s*([$A-Z_][0-9A-Z_$]*)\s*' + rDelimiter);
        conditionalRegExp = new RegExp(lDelimiter + '\s*if\s*\(\s*(.*)\s*\?\s*(.*)\s*(?:\:\s*(.*))?\s*\)' + rDelimiter);

        while (match = valueRegExp.exec(templateHTML)) {
            prop = match[1];
            templateHTML = templateHTML.replace(match, (model.get(prop) || prop));
        };

        while (match = conditionalRegExp.exec(templateHTML)) {
            cond = match[1];
            prop1 = match[2];
            prop2 = match[3];
            templateHTML = templateHTML.replace(match, (eval(cond) ? prop1 : (prop2 || prop1)));
        };

        return templateHTML;
    };

    // Service factory

    // Controller factory
})(VineWhip);