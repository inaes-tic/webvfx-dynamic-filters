ko.bindingHandlers.WebvfxSimpleWidget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var currentValue = ko.utils.unwrapObservable(value);
        currentValue["el"] = $(element);
        this.widget = new WebvfxSimpleWidget(currentValue);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var currentValue = ko.utils.unwrapObservable(value);
        currentValue["el"] = $(element);
        this.widget.remove();
        this.widget = new WebvfxSimpleWidget(currentValue);
    }
};

ko.bindingHandlers.WebvfxAnimationWidget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var data = value.data.model().attributes;
        data["el"] = $(element);
        data["path"] = value.path;
        this.widget = new WebvfxAnimationWidget(data);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var data = value.data.model().attributes;
        data["el"] = $(element);
        data["path"] = value.path;
        this.widget.remove();
        this.widget = new WebvfxAnimationWidget(data);
    }
};

