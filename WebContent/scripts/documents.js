$(document).ready(function ()
{
	$("ul.folders li > a").bind("click", function()
	{
		$(this).toggleClass("expanded");			
		$(this).parent().find("div.files").slideToggle();
		return false;
	});	
});
