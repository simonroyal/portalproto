$(document).ready(function ()
{	
	if ($("#myLocation").length > 0)
	{
		if ($("#myLocationId").val() == "")
		{
			$("#myLocation").val("Select Your Location");
		}
	}	

	if ($.cookie("myLocation.remember") && $.cookie("myLocation.remember") == "1")
	{
		$("#rememberLocation").prop("checked", true);
	}
	
	$("#myLocationBar a.switch").on("click", function()
	{
		$("#myLocation").hide();
		$("#locationSearch").show();
		$("#myLocationBar a.search").show();
		$("#rememberLabel").show();
		$("#rememberLocation").show();
		$("#myLocationBar a.switch").hide();
		$("#myLocationBar a.cancel").show();
		$("#locationSearch").focus();
		return false;
	});

	$("#myLocationBar a.cancel").on("click", function()
	{
		$("#myLocation").show();
		$("#locationSearch").hide();
		$("#myLocationBar a.search").hide();
		$("#rememberLabel").hide();
		$("#rememberLocation").hide();
		$("#myLocationBar a.switch").show();
		$("#myLocationBar a.cancel").hide();
		$("#myLocationSearchResult").hide();
		return false;
	});
	
	// Set or clear the cookie if depending upon whether the 'remember' tick box
	// is checked.
	
	$("#rememberLocation").change(function ()
	{
		if (!$(this).is(":checked"))
		{
			$.cookie("myLocation.remember", "0", { expires: 365, path: cookiePath });
			$.cookie("myLocation.id", "", { expires: 365, path: cookiePath });
		}
		else
		{
			var value =$("#myLocationId").val();
						
			$.cookie("myLocation.remember", "1", { expires: 365, path: cookiePath });
			$.cookie("myLocation.id", value, { expires: 365, path: cookiePath });
		}
	});		
	
	$("#myLocationBar a.search").on("click", function()
	{		
		$("#myLocationSearchResult").displayResults(
		{
			url: root + "/selfserve/locationlookup.jsf?search=" + encodeURIComponent($(escapeClientId("mainForm:myLocationView:locationSearch")).val()),
			recordName: "Locations",
			rowClass: "clickable",
			columnBefore: true,
			columnBeforeHtml: "<a href='#' onclick='return false'>Select Location</a>",
			errorMsg: "There was a problem searching Locations.",
			onAfter: function(resultData, resultData2)
			{
				$("#myLocationSearchResult table.results tbody tr").on("click", function()
				{
					if (!($("#myLocationBar").hasClass("isBusy")))
					{
						switchLocation($(this).find("td:eq(1)").html());
					}					
				});
								
				$("#myLocationSearchResult table.results a").on("click", function()
				{
					$(this).parent().parent().trigger("click");
					return false;
				});
			}
		});			
		
		return false;
	});
	
	$("#locationSearch").keypress(function(e)
	{
		if (e.which == 13)
		{
			$("#myLocationBar a.search").trigger("click");
			return false;
		}
	});

	// When the location has changed trigger any other subscribers that need
	// to know when the location has changed.
	
	$(document).on("switchedLocationEvent", function(e, locationData)
	{
		var subscribers = $(".switchedLocationEvent");
				
		if (subscribers && subscribers.length > 0)
		{
			subscribers.trigger("switchedLocationHandler", [locationData]);
		}
	});
});

/**
 * Switch to a new location
 * 
 * @param nextLocation  The ID of the location to switch to.
 */
function switchLocation(nextLocation)
{
	$("#myLocationSearchResult div.busy p").html("Switching Locations...");
	$("#myLocationSearchResult div.busy").show();
		
	$.getJSON(root + "siteuser/switchlocation.jsf?location=" + encodeURIComponent(nextLocation), function(data) 
	{					
	})
		.done(function(data)
		{
			if (data && data.login)
			{
				switchToUrl(loginUrl);
			}
			else if (data)
			{
				$(escapeClientId("mainForm:myLocationView:myLocationId")).val(data.locationId);				
				$(escapeClientId("mainForm:myLocationView:myLocation")).val(data.description);
				
				$("#myLocationBar a.cancel").trigger("click");
				
				$(document).trigger("switchedLocationEvent", [{locationId: data.locationId, description: data.description}]);
				
				if ($(escapeClientId("mainForm:myLocationView:rememberLocation")).is(":checked"))
				{
					$.cookie("myLocation.remember", "1", { expires: 365, path: cookiePath });
					$.cookie("myLocation.id", data.LocationId, { expires: 365, path: cookiePath });					
				}
			}
			else
			{
				showMessage("There was a problem switching locations.", "#myLocationSearchResult div.messages");
			}
		})
		.fail(function()
		{
			showMessage("There was a problem switching locations.", "#myLocationSearchResult div.messages");
		})
		.always(function() 
		{
			$("#myLocationSearchResult div.busy").hide();
			$("#myLocationSearchResult div.busy p").html("Searching Locations...");
		});
}