<?php 
	/* This is an example of how to integrate photostream.js in wordpress, you can just place this file in the twentyeleven theme and the work with it */
	/* 
		If you placed this file in a theme : 
		1. Go to pages, add page, and create a new page.
		2. Then add 2 custom fields (http://codex.wordpress.org/Custom_Fields 
			a. "photostream.js[instagram][username]" with a value of the instagram username
			b. "photostream.js[instagram][apikey]" with a value of the API KEY from instagram
		3. Publish page. 

		If you like what you see, please extend the plugin and don't hotlink to the raw files, better download them and host them yourself.
		Thank you.
	*/

	/* Template Name: PhotoStream.js [Instagram] */
	
	function photostream_js()
	{
		// For demonstration purposes only, don't hotlink to these files!
		wp_enqueue_script('photostream.js', 'https://raw.github.com/Zenger/photostream.js/master/js/photostream.js', array('jquery'), '0.1', true);
		wp_enqueue_script('colorbox', 'http://www.jacklmoore.com/colorbox/colorbox/jquery.colorbox.js', array('jquery'), '1.3.20.1', true);
		wp_enqueue_style('colorbox','http://www.jacklmoore.com/colorbox/example1/colorbox.css', null, '1.3.20.1');
	}

	add_action('wp_enqueue_scripts', 'photostream_js');

	get_header();

	


	function init_photostream_js()
	{


		$username = get_post_meta(get_the_ID(), 'photostream.js[instagram][username]', true);
		$api = get_post_meta(get_the_ID(), 'photostream.js[instagram][apikey]', true);

		?>
		<script type="text/javascript">
		jQuery(function() {

			var settings = {
				dribbble : {parse:false}, //stop dribbble
				flickr   : {parse:false}, //stop flickr
				// Run only instagram
				instagram: {
					parse:true,
					username: "<?php echo $username; ?>",
					apikey: "<?php echo $api; ?>",
					selector : jQuery('#instagram'),
					items   : "<li class='instagram'><a title='{caption}' class='zoom' href='{src}'><img class='w150' alt='{caption}' src='{thumb}' /></a></li>" // this is not the default, it's just an example
			
				}
			};


			var ps = jQuery.photostream(settings);

			jQuery('#instagram').bind('photostream.js_instagram_ready', function(items) {
			
			// We have hidden the images and we're going to show them only when they're loaded.
			jQuery('#instagram img').load(function() {
					jQuery(this).animate({opacity:1}, 250);

					// and bind colorbox
					jQuery(this).parent().attr('rel', 'group').colorbox();
				});
			});

		});
		</script>

		<style type="text/css">
		#instagram ul {
			list-style:none;
		}
		.photostreamjs img
		{
			opacity:0;
		}
		.photostreamjs a 
		{
			display:block;
			float:left;
			width:150px;
			height:150px;
			padding:15px;
			background:url("<?php echo site_url(); ?>/wp-admin/images/loading.gif") no-repeat center;
		}
		</style>
		<?php
	}

	add_action('wp_footer', 'init_photostream_js');

?>


<div id="primary">
			<div id="content" role="main">
				<!-- Our selector goes here -->
				<div id="instagram">&nbsp;</div>

			</div><!-- #content -->
		</div><!-- #primary -->

<?php get_footer(); ?>