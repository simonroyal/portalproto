$(document).ready(function ()
{	
	$("div.searchResults.switchedLocationEvent").on("switchedLocationHandler", function(e, locationData)
	{
		$("#surveys").displayResults(
		{
			url: root + "selfserve/wosurveylookup.jsf?t=2",
			recordName: "Work Order Surveys",
			paging: false,
			rowClass: "clickable",
			errorMsg: "There was a problem searching Surveys",
			onAfter: function(resultData, resultData2)
			{		
				$("#surveys table.results tbody tr").on("click", function()
				{
					openUrl($(this).find("td").eq(6).find("a").attr("href"));				
					return false;
				});

				$("#surveys table.results tbody tr").each(function (i, row)
				{
					var link = $(row).find("td").eq(6).text();
					$(row).find("td").eq(6).html("<a href='" + link + "' target='_blank'>Link</a>");
				});
						
				$("#surveys table.results a").on("click", function()
				{
					$(this).parent().parent().trigger("click");
					return false;
				});						
			}
		});	
	});
	
	if ($(escapeClientId("mainForm:myLocationView:myLocationId")).val() != "")
	{
		$("div.searchResults.switchedLocationEvent").trigger("switchedLocationHandler");
	}
});
