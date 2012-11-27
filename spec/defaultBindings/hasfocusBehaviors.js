describe('Binding: Hasfocus', function() {
    beforeEach(jasmine.prepareTestNode);

    it('Should respond to changes on an observable value by blurring or focusing the element', function() {
        var currentState;
        var model = { myVal: ko.observable() }
        testNode.innerHTML = "<input data-bind='hasfocus: myVal' /><input />";
        ko.applyBindings(model, testNode);
        ko.utils.registerEventHandler(testNode.childNodes[0], "focusin", function() { currentState = true });
        ko.utils.registerEventHandler(testNode.childNodes[0], "focusout",  function() { currentState = false });

        // When the value becomes true, we focus
        model.myVal(true);
        expect(currentState).toEqual(true);

        // When the value becomes false, we blur
        model.myVal(false);
        expect(currentState).toEqual(false);
    });

    it('Should set an observable value to be true on focus and false on blur', function() {
        var model = { myVal: ko.observable() }
        testNode.innerHTML = "<input data-bind='hasfocus: myVal' /><input />";

        runs(function() {
            ko.applyBindings(model, testNode);
        });

        waits(10);
        runs(function() {
            testNode.childNodes[0].focus();
        });

        waits(10);
        runs(function() {
            expect(model.myVal()).toEqual(true);

            // Move the focus elsewhere
            testNode.childNodes[1].focus();
        });

        waits(10);
        runs(function() {
            expect(model.myVal()).toEqual(false);

            // If the model value becomes true after a blur, we re-focus the element
            // (Represents issue #672, where this wasn't working)
            var didFocusExpectedElement = false;
            ko.utils.registerEventHandler(testNode.childNodes[0], "focusin", function() { didFocusExpectedElement = true });
            model.myVal(true);
            expect(didFocusExpectedElement).toEqual(true);
        });
    });

    it('Should set a non-observable value to be true on focus and false on blur', function() {
        var model = { myVal: null };
        testNode.innerHTML = "<input data-bind='hasfocus: myVal' /><input />";

        runs(function() {
            ko.applyBindings(model, testNode);
        });

        waits(10);
        runs(function() {
            testNode.childNodes[0].focus();
        });

        waits(10);
        runs(function() {
            expect(model.myVal).toEqual(true);

            // Move the focus elsewhere
            testNode.childNodes[1].focus();
        });

        waits(10);
        runs(function() {
            expect(model.myVal).toEqual(false);
        });
    });

    it('Should be aliased as hasFocus as well as hasfocus', function() {
        expect(ko.bindingHandlers.hasFocus).toEqual(ko.bindingHandlers.hasfocus);
    });
});