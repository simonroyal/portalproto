$(document).ready(function ()
{
	$("#nav ul li").eq(0).css("background-image", "none");
	
	$("input[type='radio']").addClass("radio");
	$("input[type='checkbox']").addClass("checkbox");
	$("input[readonly='readonly']").addClass("readonly");
	$("input[type='text']").addClass("typeText");
		
	$("input[type='submit']").hover(
		function ()
		{
			$(this).addClass("pointer");
		},
		function ()
		{
			$(this).removeClass("pointer");
		}
	);
	
	$("input[type='button']").hover(
		function ()
		{
			$(this).addClass("pointer");
		},
		function ()
		{
			$(this).removeClass("pointer");
		}
	);
	
	$("a.button3.ie6").text("...");
});
