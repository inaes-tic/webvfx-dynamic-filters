Backbone.io.connect();
var appCollection = new App.Collection();
window.appCollection = appCollection;

appCollection.fetch({success: function() {
    window.LiveCollection = new Sketch.LiveCollection();
    LiveCollection.fetch();
    var live = new LiveView({ collection: LiveCollection });
}});
