ko.bindingHandlers.WebvfxSimpleWidget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var model = value.model().attributes;
        model.options["el"] = $(element);
        model.options.style['z-index'] = model.zindex;
        this.widget = new WebvfxSimpleWidget(model.options);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var model = value.model().attributes;
        model.options["el"] = $(element);
        model.options.style['z-index'] = model.zindex;
        this.widget.remove();
        this.widget = new WebvfxSimpleWidget(model.options);
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

