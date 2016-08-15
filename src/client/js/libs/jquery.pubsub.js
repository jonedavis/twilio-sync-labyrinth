// https://gist.github.com/addyosmani/1321768#option-1-using-jquery-17s-callbacks-feature
var topics = {};

jQuery.Topic = function (id) {
    var callbacks,
        topic = id && topics[id];
    if (!topic) {
        callbacks = jQuery.Callbacks();
        topic = {
            publish: callbacks.fire,
            subscribe: callbacks.add,
            unsubscribe: callbacks.remove
        };
        if (id) {
            topics[id] = topic;
        }
    }
    return topic;
};