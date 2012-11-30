(function() {
	var exploded = false;
	ko['explodeAttribute'] = function() {
		if (exploded) {
			return;
		}
		var nodeHasBindings = ko['bindingProvider'].prototype['nodeHasBindings'];
		var getBindingsString = ko['bindingProvider'].prototype['getBindingsString'];
		var XMLNS_KO_STRING = "http://knockoutjs.com/string";
		var XMLNS_KO_LITERAL = "http://knockoutjs.com/literal";
		var findPrefixes = function(node) {
		    var kos;
		    var kol;
		    var re = /^xmlns:(.+)$/;
		    while (node && !kos && !kol) {
		        if (node.attributes) {
		            for (var i = 0; i < node.attributes.length; i++) {
		                var m = node.attributes[i].nodeName.match(re);
		                if (m) {
		                    var prefix = m[1] + ':';
		                    switch(node.attributes[i].nodeValue) {
		                        case XMLNS_KO_STRING: kos = prefix; break;
		                        case XMLNS_KO_LITERAL: kol = prefix; break;
		                    }
		                }
		            }
		        }
		        node = node.parentNode;
		    }
		    return {
		        kos: kos !== null ? kos : '{' + XMLNS_KO_STRING + '}',
		        kol: kol !== null ? kol : '{' + XMLNS_KO_LITERAL + '}'
		    };
		};
		ko.utils.extend(ko.bindingProvider.prototype, {
		    'nodeHasBindings': function(node) {
		        var hasBinding = nodeHasBindings.apply(this, arguments);
		        if (hasBinding) {
		            return true;
		        }
		        if (node.nodeType === 1 && node.attributes) {
		            var prefixes = findPrefixes(node);
		            var kos = prefixes.kos;
		            var kol = prefixes.kol;
		            for (var i = 0; i < node.attributes.length; i++) {
		                if (node.attributes[i].nodeName.indexOf(kos) === 0
		                    || node.attributes[i].nodeName.indexOf(kol) === 0) {
		                    return true;
		                }
		            }
		        }
		        return hasBinding;
		    },
		    'getBindingsString': function(node) {
		        var str = getBindingsString.apply(this, arguments) || '';
		        if (node.nodeType === 1 && node.attributes) {
		            var prefixes = findPrefixes(node);
		            var kos = prefixes.kos;
		            var kol = prefixes.kol;
		            for (var i = 0; i < node.attributes.length; i++) {
		                var attr = node.attributes[i];
		                if (attr.nodeName.indexOf(kos) === 0) {
		                    str += ',' + attr.nodeName.substr(kos.length) + ":'" + attr.nodeValue + "'";
		                }
		                else if (attr.nodeName.indexOf(kol) === 0) {
		                    str += ',' + attr.nodeName.substr(kol.length) + ":" + attr.nodeValue;
		                }
		            }
		        }
		        if (str.indexOf(',') === 0) {
		            return str.substr(1);
		        }
		        return str || null;
		    }
		});
		exploded=true;
	};
})();
