(function ($, undefined) {

    if (!$) {
        throw "Dependency: jQuery is not defined. Check javascript file imports.";
    }

    var defaults = {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        data: null
    },
    // CRUD
        operations = {
            $create: {
                type: "POST",
                processData: true
            },
            $read: {
                type: "GET",
                processData: false
            },
            $update: {
                type: "PUT",
                processData: true
            },
            $delete: {
                type: "DELETE",
                processData: false
            }
        };

    function prepareUri(url, data) {

        // replaces tokens with their actual values and removes the replaced values from the data array
        // e.g. url: "service/{route}?tag={tag}", data: {route:"bookmarks", tag:"public"} => service/bookmarks?tag=public
        var k,
            v,
            u;

        for (k in data) {
            v = data[k];
            u = url.replace('{' + k + '}', v);

            if (u !== url) {
                url = u;
                delete data[k];
            }
        }

        return url;

    }

    function prepareData() {

        // handle JSON serialization from Object
        if (this.data && typeof this.data !== "string") {

            if ($.isEmptyObject(this.data)) {
                this.data = null;
            } else {
                this.data = JSON.stringify(this.data);
            }
        }
    }

    function prepare(uri, data, callback, options) {

        if (typeof uri !== "string" || !uri) {
            throw "Parameter: 'uri' must be of type string";
        }

        if (options && $.isPlainObject(options) === false) {
            throw "Parameter: 'options' must be of type object";
        }

        options = options || {};

        // merge default settings and the current operation (crud operation) settings
        var o = $.extend({}, defaults, operations[this]);

        // determine if data is a function or an object
        // 1. function - $.Read("uri", OnSuccess)
        // 2. object - $.Read("uri", {} )
        if ($.isFunction(data)) {

            // determine if the callback is an object
            // 1. object - $.Read("uri", OnSuccess, {} )
            if ($.isPlainObject(callback)) {
                options = callback;
            }

            callback = data;
            data = null;
        } else {

            uri = prepareUri(uri, data);
            options.data = data.data || data;

            // determine if callback is a function or an object
            // 1. object - $.Read("uri", {}, {} )
            // 2. function - $.Read("uri", {}, OnSuccess )
            if ($.isPlainObject(callback)) {
                options = callback;
                callback = null;
            }
        }

        o.url = uri;

        if (callback) {
            o.success = callback;
        }
        if (options) {
            prepareData.apply(options);
            $.extend(o, options);
        }

        return o;

    }

    function execute(options) {
        return $.ajax(options);
    }

    // extend jQuery
    $.extend({

        Create: function (uri, data, callback, options) {
            ///<summary>Create operation (uses POST by default)</summary>
            ///[String] the uri template (required)
            ///[Object|Function] token replacements and/or JSON object OR the $.ajax success callback (optional)
            ///[Object|Function] the $.ajax success callback OR the $.ajax settings (optional)
            ///[Object] the $.ajax settings (optional)
            return execute(prepare.apply("$create", arguments));
        },
        Read: function (uri, data, callback, options) {
            ///<summary>Read operation (uses GET by default)</summary>
            ///[String] the uri template (required)
            ///[Object|Function] token replacements and/or JSON object OR the $.ajax success callback (optional)
            ///[Object|Function] the $.ajax success callback OR the $.ajax settings (optional)
            ///[Object] the $.ajax settings (optional)
            return execute(prepare.apply("$read", arguments));
        },
        Update: function (uri, data, callback, options) {
            ///<summary>Update operation (uses PUT by default)</summary>
            ///[String] the uri template (required)
            ///[Object|Function] token replacements and/or JSON object OR the $.ajax success callback (optional)
            ///[Object|Function] the $.ajax success callback OR the $.ajax settings (optional)
            ///[Object] the $.ajax settings (optional)
            return execute(prepare.apply("$update", arguments));
        },
        Delete: function (uri, data, callback, options) {
            ///<summary>Delete operation (uses DELETE by default)</summary>
            ///[String] the uri template (required)
            ///[Object|Function] token replacements and/or JSON object OR the $.ajax success callback (optional)
            ///[Object|Function] the $.ajax success callback OR the $.ajax settings (optional)
            ///[Object] the $.ajax settings (optional)
            return execute(prepare.apply("$delete", arguments));
        }
    });

} (jQuery));