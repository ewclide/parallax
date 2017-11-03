#Paralax effect
-------------

### Description

	setup paralax effect on elements of the page


### Agruments

- sens
- radius
- type
- background
- direction
- reverse

-------------

	it have two way for initialize:
	1) create div element with class "paralax" and define attributes wich must begin from "data-" + option
	2) use javascript notation as you can see below

### Examples

```html
	<div class="paralax"
		 data-sens="0.5"
		 data-radius="500"
		 data-type="mouse"
		 data-background="image.jpg"
		 data-direction="x"
		 data-reverse="true"
	></div>
```

```js
	$('.someclass').paralax({
		sens : 0.5,
		radius : "500",
		type : "mouse",
		background : "image.jpg",
		direction : "x",
		reverse : true
	});
```

-------------
Thank's for using.
Developed by Ustinov Maxim - [ewclide](http://vk.com/ewclide)