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

    VineWhip.objProto = function(obj, proto) {
        protoMaker = function(_obj){ VineWhip.objExtend(this, _obj) };
        protoMaker.prototype = proto;
        return new protoMaker(obj);
    };



    // Model factory

    VineWhip.Model = function(o) {
        VineWhip.assertType(o, Object);

        // Create Model constructor
        Model = function(fields) {
            if (fields) VineWhip.objExtend(this, fields);
        };

        // Inherit Model default attrs and methods
        Model.prototype = VineWhip.objProto(o.defaults || {}, VineWhip.Model._objProto);

        // Meta-info
        Model.prototype._modelCtor = Model;

        // Set specific Model methods
        for (prop in o) {
            if (o.hasOwnProperty(prop) && (modelProps.indexOf(prop) != -1)) {
                Model.prototype[prop] = o[prop];
            }
        };

        return Model;
    };

    // Model prototype

    VineWhip.Model._objProto = {};

    VineWhip.Model._objProto.set = function(fields) {
        VineWhip.assertType(fields, Object);        

        VineWhip.objExtend(this, fields);
    };

    VineWhip.Model._objProto.get = function(key) {
        return this[key];
    };



    // View factory

    VineWhip.View = function(o) {
        VineWhip.assertType(o, Object);

        viewProps = ['template'];
        for (var i = viewProps.length - 1; i >= 0; i--) VineWhip.assertProperty(o, viewProps[i]);
    
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
            if (o.hasOwnProperty(prop) && (viewProps.indexOf(prop) != -1)) {
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
        valueRegExp = new RegExp('{%' + '\\s*([$A-Z_][0-9A-Z_$]*)\\s*' + '%}', 'ig');
        evalRegExp = new RegExp('{!' + '\\s*(.*)\\s*' + '!}', 'ig');

        replacements = {};
        while (match = valueRegExp.exec(templateHTML)) {
            prop = match[1];
            replacements[match[0]] = (model.get(prop).toString() || prop);
        };
        for (tag in replacements) templateHTML = templateHTML.replace(tag, replacements[tag]);

        replacements = {};
        while (match = evalRegExp.exec(templateHTML)) {
            expr = match[1];
            try {
                replacements[match[0]] = eval(expr).toString();
            } catch (e) {
                throw new VineWhip.UserException("Bad expression evaluation: " + eval + "\n" + e);
            }
        };
        for (tag in replacements) templateHTML = templateHTML.replace(tag, replacements[tag]);

        return templateHTML;
    };

    // Service factory

    // Controller factory
})(VineWhip);