<h1>PhotoStream.js</h1>
Photostream library for jQuery. Currently supports Flickr, Instagram, Dribbble. <br />
For full example see index.html
<h1>Quick Setup</h1>
Add jQuery

```html
<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
```

Add photostream.js

```html
<script src="./js/photostream.js"></script>
```

Init photostream.js

```javascript
var settings = {
  		instagram : {
				parse   : true, // Enable/Disable this module
				selector: jQuery("#instagram"), // Select the ID or the class, will hold all the items
				user    : "", // instagram username
				apikey  : "", // your api key, you can grab it at http://instagram.com/developer/register/
				limit   : 11,
			},

			flickr : {
				parse    : true, // enable flickr
				selector : jQuery('#flickr'),
				user     : "",
			},

			dribbble : {
				parse    :true, // enable/disable dribble
				selector : jQuery('#dribbble'),
				user     : "" 
			},

		};
		var photostream = jQuery.photostream(settings);
```

And you're done! <br />
In the index.html file you will see a better implementation of photostream.js with events and custom items. <br />
Also consult the photostream.js source for more options. 
