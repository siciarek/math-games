/**
 * HTTP Request support
 * @constructor
 */
var Request = function () {
    this.href = location.href;
    this.host = this.href.split('?').shift();
    this.query = this.href.split('?').pop();
    this.params = this.getParams();
};

Request.prototype.constructor = Request;

Request.prototype.getParams = function () {
    var params = {};
    if (location.search) {
        var parts = location.search.slice(1).split('&');
        parts.forEach(function (part) {
            var pair = part.split('=');
            pair[0] = decodeURIComponent(pair[0]);
            pair[1] = decodeURIComponent(pair[1]);
            params[pair[0]] = (pair[1] !== 'undefined') ? pair[1] : true;
        });
    }
    return params;
};
