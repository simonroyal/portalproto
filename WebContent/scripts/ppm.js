$(document).ready(function ()
{
	$("#ppmCalendar").on("switchedLocationHandler", function(e, eventInfo)
	{
		$(this).find("h2 span").text("for " + eventInfo);		
		$("#ppmCalendar").ppmCalendar();
	});	
			
	if ($("#currentLocation p.current span.notSet").length == 0)
	{
		$("#ppmCalendar").ppmCalendar();
	}			
});
