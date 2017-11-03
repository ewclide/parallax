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

		get coords()
		{
			return this._coords;
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

		multiply(vec)
		{
			this._coords = Vector.multiply(this._coords, vec.coords);
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
			var self = this,
				coords = this.element.getBoundingClientRect(),
				defaults = {
					sens : 0.2,
					radius : 0,
					type : "scroll",
					background : false,
					direction : false,
					reverse : "false"
				}

			this.addSettings(options, defaults);

			if (this.settings.background) this.translateType = "background";
			else this.translateType = "element";

			this.width = this.$element.width();
			this.height = this.$element.height();

			this.pos = {
				x : coords.left + (this.width / 2),
				y : coords.top + (this.height / 2)
			}

			if (!this.settings.direction && this.settings.type == "scroll")
				this.settings.direction = "y";

			if (this.settings.type == "scroll")
			{
				this.onStartPage = this.element.getBoundingClientRect().top + window.pageYOffset < window.innerHeight ? true : false;
				this.scrollHeight = window.innerHeight * 3;
			}

			if (this.settings.background)
			{
				var img = document.createElement("img");
					img.src = this.settings.background;
					img.onload = function()
					{
						self.imgPos = {
							x : (self.width - img.width) / 2,
							y : (self.height - img.height) / 2
						}
					}

				this.element.style.background = "url(" + this.settings.background + ")";
				this.element.style.backgroundPosition = "50%";
			}
		}

		get offsetTop()
		{
			var offset = 0;

			if (this.onStartPage) offset = window.pageYOffset - Math.floor(window.pageYOffset / this.scrollHeight) * this.scrollHeight;
			else offset = -this.element.getBoundingClientRect().top;

			return offset;
		}

		get active()
		{
			var pos = window.innerHeight - this.element.getBoundingClientRect().top;

			if (pos > 0 && pos < window.innerHeight + this.height) return true;
			else return false;
		}

		translate(vector, distance)
		{
			var sens = +this.settings.sens,
				radius = +this.settings.radius;

			if (this.settings.direction == "x")
				vector[1] = 0;
			else if (this.settings.direction == "y")
				vector[0] = 0;

			if (this.settings.reverse == "true")
				vector = Vector.reverse(vector);

			distance = distance * sens;

			if (radius && distance > radius)
				distance = radius;

			vector = Vector.multiply(vector, distance);

			if (this.settings.background)
			{
				vector[0] = vector[0] + this.imgPos.x;
				vector[1] = vector[1] + this.imgPos.y;
				this.element.style.backgroundPosition = vector[0] + "px " + vector[1] + "px";
			}
			else
			{
				this.element.style.transform = "translate(" + vector[0] + "px ," + vector[1] + "px)";
			}
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
			this.scrollList = [];
			this.mouseList = [];
		}

		add(element)
		{
			if (element.settings.type == "scroll")
				this.scrollList.push(element);

			else if (element.settings.type == "mouse")
				this.mouseList.push(element);
		}

		get update()
		{
			var self = this,
				fn = {};

			fn.onMouseMove = function(coords)
			{
				self.mouseList.forEach(function(chunk){

					if (chunk.active)
					{
						var vector = [ coords.x - chunk.pos.x, coords.y - chunk.pos.y ],
							distance = Vector.getLength(vector);

						vector = Vector.normalize(vector);

						chunk.translate(vector, distance);
					}
				});
			}
			fn.onScroll = function()
			{
				self.scrollList.forEach(function(chunk){
					if (chunk.active)
						chunk.translate([1, 1], chunk.offsetTop);
				});
			}
			return fn;
		}

		start()
		{
			var self = this;

			document.addEventListener("scroll", function(e){
				self.update.onScroll();
			});

			document.addEventListener("mousemove", function(e){
				self.update.onMouseMove({
					x : e.clientX,
					y : e.clientY
				});
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