'use strict'

;(function(){

	class Vector
	{
		constructor(coords)
		{
			this._coords = 0;
			this._normal = 0;
			this._reverse = 0;
			this._length = 0;

			this.coords = coords;
		}

		set coords(data)
		{
			this._coords = data;
			this._normal = null;
			this._length = null;
			this._reverse = null;
		}

		get normal()
		{
			if (!this._normal)
				this._normal = Vector.normalize(this._coords, this._length);

			return this._normal
		}

		get length()
		{
			if (!this._length)
				this._length = Vector.getLength(this._coords);

			return this._length;
		}

		get reverse()
		{
			if (!this._reverse)
				this._reverse = Vector.reverse(this._coords);

			return this._reverse;
		}
	}

	Vector.reverse = function(vec)
	{
		return vec.map(function(coord){
			return -coord
		});
	}

	Vector.normalize = function(vec, length)
	{
		var length = length || Vector.getLength(vec);

		return vec.map(function(coord){
			return coord / length;
		});
	}

	Vector.getLength = function(vec)
	{
		var sum = 0;

		vec.forEach(function(coord){
			sum += Math.pow(coord, 2);
		});

		return Math.sqrt(sum);
	}

	Vector.multiply = function(vec_1, vec_2)
	{
		if (typeof vec_2 == "number")
			return vec_1.map(function(coord){
				return coord * vec_2;
			});
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
				sens : 0.2,
				radius : 0,
				type : "scroll",
				background : false,
				rolltype : "vertical",
				reverse : false
			}

			this.addSettings(options, defaults);

			var coords = this.element.getBoundingClientRect();
			this.winPos = {
				y : coords.top,
				x : coords.left
			}

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

				var radius = +chunk.settings.radius,
					sens = +chunk.settings.sens,
					vector = [
						coords.x - chunk.winPos.x - (chunk.width / 2),
						coords.y - chunk.winPos.y - (chunk.height / 2)
					],
					distance = Vector.getLength(vector);

				if (chunk.settings.reverse)
					vector = Vector.reverse(vector);

				if (radius && distance > radius)
				{
					vector = Vector.normalize(vector);
					vector = Vector.multiply(vector, radius);
				}

				self.translate(chunk.element, vector, sens);

			});
		}

		translate(element, vec, sens)
		{
			element.style.transform = "translate(" + vec[0] * sens + "px ," + vec[1] * sens + "px)";
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