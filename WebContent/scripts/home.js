$(document).ready(function ()
{		
	// Update the open orders when the user switches to a different location.
	
	$("div.searchResults.switchedLocationEvent").on("switchedLocationHandler", function(e, locationData)
	{
		$(escapeClientId("mainForm:openOrders")).show();
				
		$(this).displayResults(
		{
			url: root + "selfserve/locationwolookup.jsf?",
			recordName: "Work Orders",
			rowClass: "clickable",
			columnBefore: true,
			columnBeforeHtml: "<a href='#'>View</a><img class='notShown busy' src='" + root + "images/busy-small.gif' />",
			errorMsg: "There was a problem searching Work Orders",
			onAfter: function(resultData, resultData2)
			{
				if ($("#locationOrders table.results tbody tr").length > 0)
				{
					$("#locationOrders table.results img.notShown.busy").hide().removeClass("notShown");
					
					$("#locationOrders table.results tbody tr").on("click", function()
					{
						var wonum = $(this).find("td:eq(2)").html();
						
						$(this).find("img.busy").show();
						
						$.getJSON(root + "selfserve/wolookup.jsf?search=" + encodeURIComponent(wonum), function(data) 
						{					
						})
							.done(function(data)
							{
								if (data && data.login)
								{
									switchToUrl(loginUrl);
								}
							})
							.fail(function()
							{
								showMessage("Error looking up Work Order.", "#locationOrders div.messages");
							})
							.always(function() 
							{
								switchToUrl("selfserve/workorder.jsf?w=" + encodeURIComponent(wonum) + "&p=" + new Date().getTime());		
							});
						
						return false;
					});
					
					$("#locationOrders table.results a").on("click", function()
					{
						$(this).parent().parent().trigger("click");
					});
				}
			}
		});
	});
			
	// Define the click action for each of the quick order links. Will only
	// submit a new order if the user is on a location and not already
	// in the process of submitting an order.
	
	$("#quickOrders a").on("click", function()
	{
		if (!($("ul.quickOrders").hasClass("isBusy")))
		{
			if ($(escapeClientId("mainForm:myLocationView:myLocationId")).val() == "")
			{
				showMessage("Please switch to a Location first.", "#quickOrderMessages");
			}
			else
			{
				$("ul.quickOrders").addClass("isBusy");
				$(this).next("div.busy").show();
				
				closeMessages("#quickOrderMessages");
				createQuickOrder($(this).attr("class"));			
			}
		}
				
		return false;
	});
	
	// Trigger the refresh of the open orders if the user is already on a location.
	
	if ($(escapeClientId("mainForm:myLocationView:myLocationId")).val() != "")
	{
		$("div.switchedLocationEvent").trigger("switchedLocationHandler");
	}
	
	$("table.results a.search").on("click", function()
	{
		$(this).closest("table.results").find("tr.filter").toggle();
		return false;
	});
			
	$("#locationOrders tr.filter input[type=text]").keypress(function(e)
	{
		if (e.which == 13)
		{
			$("div.switchedLocationEvent").trigger("switchedLocationHandler");
			return false;
		}		
	});
	
	// When switching to a location hide the help text on the home page that informs the
	// user to switch locations.
	
	$("div.switchedLocationEvent.locationNotSetHelp").on("switchedLocationHandler", function(e, locationData)
	{
		$(this).hide();
	});		
});

/**
 * Submit a quick order for the current location.
 * 
 * @param id  Quick order ID. Corresponds to the properties file that defines
 *            the quick order details.
 */
function createQuickOrder(id)
{	
	// Calls the URL to quickly create a work order for the current location and
	// displays the work order number for the new order.
	
	$.getJSON(root + "selfserve/quickwolookup.jsf?qo=" + id, function(data) 
	{
	})
		.done(function(data)
		{
			if (data && data.login)
			{
				switchToUrl(loginUrl);
			}
			else if (data.wonum)
			{
				showMessage("Work Order " + data.wonum + " created.", "#quickOrderMessages");
			}
			else
			{
				showMessage("There was an error creating the Work Order.", "#quickOrderMessages");
			}						
		})
		.fail(function()
		{
			showMessage("There was an error creating the Work Order.", "#quickOrderMessages");		
		})
		.always(function() 
		{
			// Remove the class to ensure another can be submitted.
			
			$("ul.quickOrders").removeClass("isBusy");				
			$("ul.quickOrders div.busy").fadeOut();
		});
}
