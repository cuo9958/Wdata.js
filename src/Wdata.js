(function (root, factory) {

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = factory(root, exports);
        }
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            root.Wdata = factory(root, exports);
        });
    } else {
        root.Wdata = factory(root, {});
    }

}(this, function (root, Wdata) {
    'use strict';

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    Wdata.arr = {};

    /**
     * 设置存储数据
     * @param {string} key     存储数据的键值
     * @param {Object} value   存储的数据
     */
    Wdata.set = function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify({ "data": value }));
        } catch (e) {
            if (console) console.warn("数据库满了。");
        }
    };

    /**
     * 获取存入的数据
     * @param  {string} key     数据的键值
     * @param  {Object} missing 查询失败的返回
     * @return {Object}         查询结果
     */
    Wdata.get = function (key, missing) {
        var value;

        try {
            value = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            try {
                if (localStorage[key]) {
                    value = JSON.parse('{"data":"' + localStorage.getItem(key) + '"}');
                } else {
                    value = null;
                }
            } catch (e) {
                if (console) console.warn("数据读取出错：" + key);
            }
        }
        if (value === null) {
            return missing;
        } else if (typeof value.data !== 'undefined') {
            return value.data;
        } else {
            return missing;
        }
    };
    /**
     * 添加一个数据数据
     * @param {string} key     数据的键值
     * @param {Object} value   数据的值
     */
    Wdata.arr.add = function (key, value) {
        var json;

        var values = Wdata.arr.get(key);

        if (values.indexOf(value) > -1) {
            return null;
        }

        try {
            values.push(value);
            json = JSON.stringify({ "data": values });
            localStorage.setItem(key, json);
        } catch (e) {
            console.log(e);
            if (console) console.warn("数据库满了");
        }
    };
    /**
     * 获取一个数据字段的数据
     * @param  {string} key     数据的键值
     * @return {Array}         查询结果
     */
    Wdata.arr.get = function (key, options) {
        var value;

        try {
            value = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            value = null;
        }

        if (value === null)
            return [];
        else
            return (value.data || []);
    };
    /**
     * 查询是否存在数据中
     * @param  {string} key   数据的字段
     * @param  {Object} value 要查询的数据
     * @return {Bool}       查询结果
     */
    Wdata.arr.isit = function (key, value) {

        return Wdata.arr.get(key).indexOf(value) > -1;
    };

    /**
     * 获取所有的数据
     * @return {Array} 数据值的数据
     */
    Wdata.getAll = function () {
        var keys = Object.keys(localStorage);

        return keys.map(function (key) {
            return Wdata.get(key);
        });
    };

    /**
     * 删除数据
     * @param  {string} key     数据的键值
     * @param  {Object} value   要删除的值
     */
    Wdata.arr.remove = function (key, value, options) {
        var json,
            index;

        var values = Wdata.arr.get(key, value);

        index = values.indexOf(value);

        if (index > -1)
            values.splice(index, 1);

        json = JSON.stringify({ "data": values });

        try {
            localStorage.setItem(key, json);
        } catch (e) {
            if (console) console.warn("数据删除出错：" + key+","+value);
        }
    };

    /**
     * 删除固定的数据
     * @param  {string} key 要移除的数据键值
     * @return {null}     
     */
    Wdata.remove = function (key) {
        localStorage.removeItem(key);
    };


    /**
     * 清除所有数据
     * @return null
     */
    Wdata.clear = function () {
        localStorage.clear();
    };
    return Wdata;

}));
