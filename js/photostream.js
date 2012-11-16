/*
  Photostream.js 0.1
  Allows you to steam photos from different sources.
  Currently available for : Instagram, Dribbble, Flickr
  License: MIT
*/
;(function( $ ){

  jQuery.photostream = function(settings) {
  		var defaults = {
  			preload : true,
  			debug   : true,
  			instagram : {
            parse   : false, // Choose to grab images from instagram or not. Disable/Enable this module.
    				selector: "", // The jQuery Selector where all the instagram items will go, may be a jquery object.
    				username    : "", // The instagram ID
    				apikey  : "", // your api key, you can grab it at http://instagram.com/developer/register/
    				limit   : 10, // per page items
            page    : 1,  // which page to show?
    				wrapper : "<div class='photostreamjs'><ul class='instagram'>{items}</ul></div>",
    				items   : "<li class='instagram'><a title='{caption}' href='{url}'><img src='{src}' alt='{caption}' /></a></li>",
    				// Valid are {url}, {caption}, {src} or {standart} for normal res, {lowres} for lowers, {thumb} for thubmanil
			  },

        flickr : {
            parse    : false,
            selector : "",
            username : "",
            limit    : 10,
            page     : 1,
            wrapper : "<div class='photostreamjs'><ul class='flickr'>{items}</ul></div>",
            items   : "<li class='flickr'><a title='{caption}' href='{src}'><img src='{thumb}' alt='{caption}' /></a></li>",
            // Valid are {url} or {link}, {caption} or {title}, {src} or {original}, {thumb}, {small_square}, {medium}
        },

        dribbble : {
            parse    : false,
            selector : "",
            username : "",
            limit    : 10,
            wrapper : "<div class='photostreamjs'><ul class='dribbble'>{items}</ul></div>",
            items   : "<li class='dribbble'><a title='{caption}' href='{src}'><img src='{thumb}' alt='{caption}' /></a></li>",
        }

  		};

  		var settings = jQuery.extend(true, defaults, settings); // true for deep recursive extend.
  		

  		// PS will act as a container, like a simulated class
  		var PS = {instagram:{}, flickr:{}, dribbble:{}, tumblr:{}, pinterest:{}};

  		
  		PS.instagram.fetch = function() {

  			if (settings.instagram.username === undefined || settings.instagram.username == "")
  			{
  				console.error("Instagram username is empty");
  				return false;
  			}

  			if (settings.instagram.apikey === undefined || settings.instagram.apikey == "")
  			{
  				console.error("Instagram apikey is empty");
  				return false;
  			}

  			if (settings.instagram.selector === undefined || settings.instagram.selector == "")
  			{
  				console.error("Selector is empty, no wrapper for items");
          return false;
  			}


  			var url = "https://api.instagram.com/v1/users/search?q=" + settings.instagram.username + "&access_token=" + settings.instagram.apikey + "&count=10&callback=?";
  			jQuery.getJSON(url, function(data) {
  				jQuery.each(data.data, function(i, user) 
  				{
  					
  					if (user.username == settings.instagram.username)
  					{
  						PS.instagram.user_id = user.id;

  						if (PS.instagram.user_id != "" && PS.instagram.user_id !== undefined)
  						{
  							var url  =  "https://api.instagram.com/v1/users/" + PS.instagram.user_id + "/media/recent/?access_token=" + settings.instagram.apikey + "&count=" + settings.instagram.limit + "&callback=?";
  							var items = {};
  							jQuery.getJSON(url, function(data) {
  								PS.instagram.parse(data.data);	
  							});
  						}
  					}
  				});
  			});


  		};
      /* Instagram */

  		PS.instagram.parse = function(data) 
  		{
  			var images = [];
  			jQuery.each(data, function(i, image) {
  				var pic = {
  					link    : image.link,
  					lowres  : image.images.low_resolution.url,
  					thumb   : image.images.thumbnail.url,
  					standard: image.images.standard_resolution.url,
  					caption : (image.caption != null) ? image.caption.text : ""
  				};
  				images.push(pic);

  			});

  			PS.instagram.populate(images);
  		};

  		PS.instagram.populate = function(images)
  		{
  			var outer = (typeof settings.instagram.selector == "string") ? jQuery(settings.instagram.selector) : settings.instagram.selector;

  			var html = "";

  			if (images !== undefined && images != "")
  			{
  				for (i in images)
  				{
  					

  					html += settings.instagram.items
                .replace(new RegExp("{url}", "gm")      , images[i].link)
  							.replace(new RegExp("{link}", "gm")     , images[i].link)
                .replace(new RegExp("{caption}", "gm")  , images[i].caption)
  							.replace(new RegExp("{title}", "gm")    , images[i].title)
  							.replace(new RegExp("{src}", "gm")      , images[i].standard)
  							.replace(new RegExp("{standard}", "gm") , images[i].standard)
  							.replace(new RegExp("{lowres}", "gm")   , images[i].lowres)
  							.replace(new RegExp("{thumb}", "gm")    , images[i].thumb);
  				}
  			}

  			var wrapper = settings.instagram.wrapper.replace(new RegExp("{items}", "gm") , html);

  			outer.html( wrapper );

        // custom events
        outer.trigger('photostream.js_instagram_ready', images);

  		};

      /* Flickr */

      PS.flickr.fetch = function() 
      {

          if (settings.flickr.user === undefined || settings.flickr.user == "")
          {
            console.error("Flickr username is empty");
            return false;
          }

         
          if (settings.flickr.selector === undefined || settings.flickr.selector == "")
          {
            console.error("Selector is empty, no wrapper for items");
            return false;
          }


          var url = "http://api.flickr.com/services/rest/?method=flickr.people.findByUsername&username=" + settings.flickr.user +"&format=json&api_key=85145f20ba1864d8ff559a3971a0a033&jsoncallback=?";
            
          jQuery.getJSON(url, function(data) {
          
            if (data.stat == "ok")
            { 
                settings.flickr.user_id = data.user.nsid;
                var url = "http://api.flickr.com/services/rest/?method=flickr.photos.search&user_id=" + settings.flickr.user_id + "&format=json&api_key=85145f20ba1864d8ff559a3971a0a033&per_page=" + settings.flickr.limit + "&page="+settings.flickr.page+"&extras=url_o,url_z,url_m,url_q,url_sq&jsoncallback=?";
                jQuery.getJSON(url , function(data){

                    PS.flickr.parse(data);
                });
            } else {
              console.log("Error occured, probably the username doesn't exist");
            }
            
          });

      };

      PS.flickr.parse = function(data)
      {
          var images = [];

         
          if (data.stat == "ok")
          {

               jQuery.each(data.photos.photo, function(i, image) {

                  
                  var pic = {
                      big         : image.url_o,
                      medium      : image.url_m,
                      thumb       : image.url_q,
                      small_squre : image.url_sq,
                      z           : image.url_z,
                      link         : "http://www.flickr.com/photos/" + image.owner + "/" + image.id,
                      caption       : image.title
                  };
                  
                  images.push(pic);
              }); 
          }
          else
          {
            console.log("Error, this user has no images");
          }

          PS.flickr.populate(images);
      };

      PS.flickr.populate = function(images) 
      {
            var outer = (typeof settings.flickr.selector == "string") ? jQuery(settings.flickr.selector) : settings.flickr.selector;
            
            
            var html = "";

            if (images !== undefined && images != "")
            {
              for (i in images)
              {
                

                html += settings.flickr.items
                    .replace(new RegExp("{url}", "gm")      , images[i].link)
                    .replace(new RegExp("{link}", "gm")     , images[i].link)
                    .replace(new RegExp("{caption}", "gm")  , images[i].caption)
                    .replace(new RegExp("{title}", "gm")    , images[i].caption)
                    .replace(new RegExp("{src}", "gm")      , images[i].big)
                    .replace(new RegExp("{original}", "gm") , images[i].big)
                    .replace(new RegExp("{thumb}", "gm")    , images[i].thumb)
                    .replace(new RegExp("{small_square}", "gm")    , images[i].small_square)
                    .replace(new RegExp("{medium}", "gm")    , images[i].z);
              }

              // available {url} or {link}, {caption} or {title}, {src} or {original}, {thumb}, {small_square}, {medium}
            }

            var wrapper = settings.flickr.wrapper.replace(new RegExp("{items}", "gm") , html);

            outer.html( wrapper );

            // custom events
            outer.trigger('photostream.js_flickr_ready', images);
      };



      /* Dribbble */
       PS.dribbble.fetch = function() 
      {

          if (settings.dribbble.user === undefined || settings.dribbble.user == "")
          {
            console.error("Dribbble username is empty");
            return false;
          }

         
          if (settings.dribbble.selector === undefined || settings.dribbble.selector == "")
          {
            console.error("Selector is empty, no wrapper for items");
            return false;
          }

        

          var url = "http://dribbble.com/" + settings.dribbble.user + "/shots.json?callback=?";
          jQuery.getJSON(url, function(data) { 
              PS.dribbble.parse(data);
          }); 
          
      };


      PS.dribbble.parse = function(data)
      {
          var images = [];
          
          jQuery.each(data.shots, function(i, image) {
           
              if (i < parseInt(settings.dribbble.limit))
              { 

                  var pic = {
                      caption   : image.title.replace("`","'"),
                      link      : image.url,
                      big       : image.image_url,
                      thumb     : image.image_teaser_url
                  };

                  images.push(pic);
                  
              }
              
          });

          PS.dribbble.populate(images);
      };


      PS.dribbble.populate = function(images)
      {
            var outer = (typeof settings.dribbble.selector == "string") ? jQuery(settings.dribbble.selector) : settings.dribbble.selector;
            
            
            var html = "";

            if (images !== undefined && images != "")
            {
              for (i in images)
              {
                

                html += settings.dribbble.items
                    .replace(new RegExp("{url}", "gm")      , images[i].link)
                    .replace(new RegExp("{link}", "gm")     , images[i].link)
                    .replace(new RegExp("{caption}", "gm")  , images[i].caption)
                    .replace(new RegExp("{title}", "gm")    , images[i].caption)
                    .replace(new RegExp("{src}", "gm")      , images[i].big)
                    .replace(new RegExp("{original}", "gm") , images[i].big)
                    .replace(new RegExp("{thumb}", "gm")    , images[i].thumb)
              }

              // available {url} or {link}, {caption} or {title}, {src} or {original}, {thumb}, {small_square}, {medium}
            }
           
            var wrapper = settings.dribbble.wrapper.replace(new RegExp("{items}", "gm") , html);

            outer.html( wrapper );

            // custom events
            outer.trigger('photostream.js_dribbble_ready', images);
      };

      /* Main Run */
  		PS.run = function() {
        // run instagram
        if (settings.instagram.parse == true)
        {
            PS.instagram.fetch();  
        }
  			

        // run flickr
        if (settings.flickr.parse == true) {
            PS.flickr.fetch();
        }
        
        // run dribbble
        if (settings.dribbble.parse == true)
        {
           PS.dribbble.fetch();
        }

  		};



  		// Run photostream
  		PS.run();


  };



})( jQuery );
