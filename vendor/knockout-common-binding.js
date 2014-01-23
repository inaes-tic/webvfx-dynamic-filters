ko.bindingHandlers.WebvfxSimpleWidget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var options = value.options();
        options["el"] = $(element);
        options.style['z-index'] = value.zindex();
        this.widget = new WebvfxSimpleWidget(options);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var options = value.options();
        options["el"] = $(element);
        options.style['z-index'] = value.zindex();
        this.widget.remove();
        this.widget = new WebvfxSimpleWidget(options);
    }
};

ko.bindingHandlers.WebvfxAnimationWidget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var data = value.data.model().attributes;
        data["el"] = $(element);
        data["path"] = value.path;
        this.widget = new WebvfxAnimationWidget(data);
        _.each(value.data, function(prop) {
            if (prop.subscribe != undefined) {
                prop();
            }
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var data = value.data.model().attributes;
        data["el"] = $(element);
        data["path"] = value.path;
        this.widget.remove();
        this.widget = new WebvfxAnimationWidget(data);
        _.each(value.data, function(prop) {
            if (prop.subscribe != undefined) {
                prop();
            }
        });
    }
};

