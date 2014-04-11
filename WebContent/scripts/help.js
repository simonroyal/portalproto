$(document).ready(function ()
{
	$("a.backToTop").on("click", function()
	{
		$("html, body").animate({scrollTop: 0}, "slow");
		return false;
	});
	
	$("ul.contents a").on("click", function()
	{
		var moveTo = $("#" + $(this).attr("class"));
		
		if (moveTo.length == 1)
		{
			$("html, body").animate({scrollTop: moveTo.offset().top}, "slow");			
		}
		
		return false;
	});			
});
