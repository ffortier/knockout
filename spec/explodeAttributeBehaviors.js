describe('Explode attribute', function() {
	beforeEach(jasmine.prepareTestNode);

	it('should find the some bindings', function() {
		testNode.innerHTML = '<div xmlns:kol="http://knockoutjs.com/literal"><input type="text" kol:value="allo"/></div>';

		ko.explodeAttribute();

		var input = testNode.firstChild.firstChild;

		expect(ko.bindingProvider.prototype.nodeHasBindings(input)).toBe(true);
		expect(ko.bindingProvider.prototype.getBindingsString(input)).toBe('value:allo');
	});

	it('should combine attributes and merge with data-bind', function() {
		testNode.innerHTML = '<div xmlns:kol="http://knockoutjs.com/literal"><input type="text" kol:test="test" kol:value="allo" data-bind="bonjour:bonjour"/></div>';

		ko.explodeAttribute();

		var input = testNode.firstChild.firstChild;

		expect(ko.bindingProvider.prototype.nodeHasBindings(input)).toBe(true);
		expect(ko.bindingProvider.prototype.getBindingsString(input)).toBe('bonjour:bonjour,test:test,value:allo');
	});

	it('should wrap string', function() {
		testNode.innerHTML = '<div xmlns:kos="http://knockoutjs.com/string"><input type="text" kos:value="allo"/></div>';

		ko.explodeAttribute();

		var input = testNode.firstChild.firstChild;

		expect(ko.bindingProvider.prototype.nodeHasBindings(input)).toBe(true);
		expect(ko.bindingProvider.prototype.getBindingsString(input)).toBe("value:'allo'");
	});
});