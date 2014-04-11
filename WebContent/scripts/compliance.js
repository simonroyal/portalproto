$(document).ready(function ()
{
	$("#complianceView").on("switchedLocationHandler", function(e, eventInfo)
	{
		$(this).find("h2 span").text("for " + eventInfo);		
		$("#complianceView").complianceChart();
	});
			
	if ($("#currentLocation p.current span.notSet").length == 0)
	{
		$("#complianceView").complianceChart();
	}
			
	if ($("#complianceView select.chartType").length > 0)
	{
		var chartType = $.cookie("compliance.chartype");
				
		if (!chartType)
		{
			$.cookie("compliance.chartype", "line", { expires: 365, path: cookiePath });		
		}
				
		$("#complianceView select.chartType").val(chartType);
				
		$("#complianceView select.chartType").on("change", function()
		{
			$.cookie("compliance.chartype", $(this).val(), { expires: 365, path: cookiePath });					
			$("#complianceView").switchComplianceChartType($(this).val());
		});
	}	
});
