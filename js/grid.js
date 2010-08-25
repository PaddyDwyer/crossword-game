jQuery.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
};

var set = function(spec) {
	var that = {};
	var contents = [];

	that.values = function() {
		return contents;
	}

	that.add = function(addValue) {
		if(contents.indexOf(addValue) < 0) {
			contents.push(addValue);
		}
	}

	that.addArray = function(addValues) {
		$(addValues).each(function(key, value) {
			that.add(value);
		});
	}

	that.remove = function(value) {
		var idx = contents.indexOf(value);
		if (idx > -1) {
			contents.splice(idx, 1);
		}
	}

	return that;
}

var Crosses = {
	horizontalPattern: /h\d*/,
	verticalPattern: /v\d*/,
	selected: "v8",
	available: set(),
	initialize: function() {
		Crosses.addInputs("v8");
	},

	addInputs: function(value) {
		$("." + value).addClass("selected");
		$("." + value + ":empty").append("<input maxlength='1' type='text' size='1'/>");
		$("input:first").focus();
		Crosses.setupInputs();
	},

	setupInputs: function() {
		var last = null;
		$("input").reverse().each(function(key, value) {
			if (last != null) {
				var previousInput = last;
				$(value).keypress(function(event) {
					var which = event.which;
					if ((which >= 65 && which <= 90) || (which >= 97 && which <= 122)) {
						$(previousInput).delay(100).focus();
					}
				});
			}
			else {
				$(value).keypress(function(event) {
					var which = event.which;
					if (which == 13) {
						setTimeout(Crosses.submitWord, 1);
					}
				});
				
			}
			last = value;
		});
		last = null;
		$("input").each(function(key, value) {
			if (last != null) {
				var previousInput = last;
				$(value).keydown(function(event) {
					var which = event.which;
					if (which == 8) {
						$(previousInput).delay(100).focus();
					}
				});
			}
			last = value;
		});
	},
	
	submitWord: function(){
		Crosses.available.remove(Crosses.selected);
		$(".selected:has(input)").each(function(key, value) {
			var css = $(value).attr("class");
			if (Crosses.selected[0] == "v") {
				var match = Crosses.horizontalPattern.exec(css);
			} else if (Crosses.selected[0] == "h") {
				var match = Crosses.verticalPattern.exec(css);
			}
			Crosses.available.addArray(match);
			var input = $("input", value);
			var letter = input.val();
			input.unbind();
			$(value).empty();

			$(value).append(letter);
		});
		$(".selected").removeClass("selected");
		$(Crosses.available.values()).each(function(key, value) {
			if (value.indexOf("h") > -1) {
				$("." + value).addClass("hor");
			} else if (value.indexOf("v") > -1) {
				$("." + value).addClass("ver");
			}
		});
		$(".hor:not(.ver)").each(function(key, value) {
			var css = $(value).attr("class");
			var match = Crosses.horizontalPattern.exec(css);
			$(value).click(Crosses.generateOnClickHandler(match[0]));
		});
		$(".ver:not(.hor)").each(function(key, value) {
			var css = $(value).attr("class");
			var match = Crosses.verticalPattern.exec(css);
			$(value).click(Crosses.generateOnClickHandler(match[0]));
		});
		$(".hor.ver").each(function(key, value) {
			var css = $(value).attr("class");
			var horMatch = Crosses.horizontalPattern.exec(css);
			var verMatch = Crosses.verticalPattern.exec(css);
			$(value).html("<div class=\"left\"></div><div class=\"right\"></div>");
			$(value).find(".left").click(Crosses.generateOnClickHandler(horMatch[0]));
			$(value).find(".right").click(Crosses.generateOnClickHandler(verMatch[0]));
		});
	},
	
	generateOnClickHandler: function(value) {
		if(value == "h9") {
			console.count("h9 bound");
		}
		return function(event) {
			Crosses.selected = value;
			$(".hor, .ver").unbind("click").empty();
			$(".hor").removeClass("hor");
			$(".ver").removeClass("ver");
			Crosses.addInputs(value);
		};
	}
}

Crosses.initialize();
