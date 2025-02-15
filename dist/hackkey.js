"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uniqid");
var InMemoryStore = function () {
    var store = {};
    var timerStore = {};
    var createTTL = function (_a) {
        var key = _a.key, id = _a.id, ttl = _a.ttl;
        var timer = setTimeout(function () {
            delete store[key];
            delete timerStore[id];
        }, ttl);
        timerStore[id] = timer;
    };
    var set = function (_a) {
        var key = _a.key, value = _a.value, ttl = _a.ttl;
        var id = uuid();
        store[key] = {
            id: id,
            data: value,
            ttl: ttl,
            created: new Date().getTime(),
            updated: null,
        };
        if (ttl)
            createTTL({ key: key, id: id, ttl: ttl });
        return store[key];
    };
    var remove = function (key) {
        var itemToBeDeleted = store[key];
        var id = itemToBeDeleted.id;
        var timer = timerStore[id];
        clearTimeout(timer);
        delete store[key];
        delete timerStore[id];
        return itemToBeDeleted;
    };
    var update = function (_a) {
        var key = _a.key, value = _a.value, ttl = _a.ttl;
        if (!ttl || !value)
            return;
        var itemToBeUpdated = store[key];
        itemToBeUpdated.updated = new Date().getTime();
        itemToBeUpdated.data = value;
        if (ttl) {
            var id = itemToBeUpdated.id;
            var timer = timerStore[id];
            clearTimeout(timer);
            createTTL({ key: key, id: id, ttl: ttl });
            itemToBeUpdated.ttl = ttl;
        }
        return store[key];
    };
    var get = function (key) {
        return store[key];
    };
    return {
        set: set,
        remove: remove,
        update: update,
        get: get,
    };
};
exports.default = InMemoryStore;
