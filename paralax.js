'use strict'

;(function(){

	function getVectorLength(vec)
	{
		return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
	}

	function normalize(vec, length)
	{
		var length = length || getVectorLength(vec);

        return {
        	x : vec.x / length,
        	y : vec.y / length
        }
	}

	class Chunk
	{
		constructor(options)
		{
			this.element = options.element[0];
			this.$element = options.element;
			this.settings = {};
			this.init(options);
		}

		init(options)
		{
			var defaults = {
				sens : 0.5,
				radius : 100,
				type : "scroll",
				background : false,
				rolltype : "vertical",
				direction : "revers"
			}

			this.addSettings(options, defaults);

			var coords = this.element.getBoundingClientRect();
			this.winPos = {
				y : coords.top,
				x : coords.left
			}

			if (this.settings.radius)
				this.element.style.transition = "0.25s";

			this.width = this.$element.width();
			this.height = this.$element.height();

			console.log(this)
		}

		addSettings(options, defaults)
		{
			for (var opt in defaults)
			{
				var attr = this.$element.attr("data-" + opt),
					def = attr ? attr : defaults[opt];

				if (options[opt] === undefined)
					this.settings[opt] = def;
				else
					this.settings[opt] = options[opt];
			}
		}
	}

	class Paralax
	{
		constructor()
		{
			this.scroll = [];
			this.mouse = [];
		}

		add(element)
		{
			if (element.settings.type == "scroll")
				this.scroll.push(element);

			else if (element.settings.type == "mouse")
				this.mouse.push(element);
		}

		update(list, coords)
		{
			var self = this;

			list.forEach(function(chunk){

				var vec = {
						x : coords.x - chunk.winPos.x - (chunk.width / 2),
						y : coords.y - chunk.winPos.y - (chunk.height / 2)
					}

				if (chunk.settings.reverse)
				{
					vec.x = -vec.x;
					vec.y = -vec.y;
				}
				
				var distance = getVectorLength(vec);

				// self.translate({
				// 	element : chunk.element,
				// 	distance : distance,
				// 	coords : vec,
				// 	sens : chunk.settings.sens,
				// 	radius : chunk.settings.radius
				// });

				if (chunk.settings.radius && distance > +chunk.settings.radius)


				self.translate(chunk.element, vec, sens);

			});
		}

		translate(element, coords, sens)
		{
			element.style.transform = "translate(" + coords.x * sens + "px ," + coords.y * sens + "px)";
		}

		translate_(data)
		{
			if (data.radius && data.distance <= +data.radius)
				data.element.style.transform = "translate(" + data.coords.x * data.sens + "px ," + data.coords.y * data.sens + "px)";
			else if (!data.radius)
				data.element.style.transform = "translate(" + data.coords.x * data.sens + "px ," + data.coords.y * data.sens + "px)";
		}

		start()
		{
			var self = this;

			console.log(this);

			document.addEventListener("scroll", function(e){
				//paralax.update();
			});

			document.addEventListener("mousemove", function(e){
				var coords = {
					x : e.clientX,
					y : e.clientY
				};
				self.update(self.mouse, coords);
			});
		}
	}

	$.fn.paralax = function(options)
    {
    	var paralax = new Paralax();

        this.each(function(){
            if (options) options.element = $(this);
            else options = { element: $(this) };
            var chunk = new Chunk(options);
            paralax.add(chunk);
        });

        paralax.start();
    }

    $(document).ready(function(){
        $('.paralax').paralax();
    });

})();