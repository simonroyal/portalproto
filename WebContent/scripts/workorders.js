$(document).ready(function ()
{
	var urlParams = getUrlParams();
	
	if (urlParams && urlParams.t && urlParams.p)
	{
		var page = parseInt(urlParams.p);
		
		if (isNaN(page) || page < 1)
		{
			page = 1;
		}
		
		urlParams.p = page;
	}
	
	$("#findWoButton").on("click", function()
	{
		var field = escapeClientId("mainForm:findWoView:wonumSearch");
		
		if ($(field).hasClass("defaultText") || $(field).val().trim() == "")
		{
			showMessage("Enter something to search on.", "#woSearchMessages");
		}
		else
		{
			findOrder($(field).val());
		}
		
		return false;
	});
	
	$(escapeClientId("mainForm:findWoView:wonumSearch")).keypress(function(e)
	{
		if (e.which == 13)
		{
			$("#findWoButton").trigger("click");
			return false;
		}
	});	
	
	$("div.tabs li a").on("click", function()
	{
		var current = $("div.tabs li.selected").index();
		var show = $(this).parent().index();
				
		if (current != show)
		{
			$("div.tab").eq(current).hide();
			$("div.tab").eq(show).slideDown();
			$("div.tabs li.selected").removeClass("selected");
			$(this).parent().addClass("selected");
			
			$("div.tab").eq(show).trigger("displayTab");			
		}
		
		return false;
	});	
	
	$("div.switchedLocationEvent").on("switchedLocationHandler", function(e, locationData)
	{
		var current = $("div.tabs li.selected").index();
		
		if ($("div.tab").eq(current).attr("id") == "mainForm:locationOrdersTab")
		{
			locationOrders(1);
		}
		else
		{
			$("#locationOrders").hide();
		}
	});
	
	$("#logNotes").on("displayTab", function(e)
	{
		if ($("#woLogNotes").is(":hidden"))
		{
			logNoteSearch();
		}
	});
	
	$("#surveyTab").on("displayTab", function(e)
	{
		if ($("#surveys").is(":hidden"))
		{
			surveySearch();
		}
	});	

	$("#myOrdersTab").on("displayTab", function(e)
	{
		if ($("#myOrders").is(":hidden"))
		{
			if (urlParams && urlParams.t && urlParams.p)
			{
				myOrders(urlParams.p);
			}
			else
			{
				myOrders(1);
			}
		}		
	});
	
	$(escapeClientId("mainForm:locationOrdersTab")).on("displayTab", function(e)
	{
		if ($("#locationOrders").is(":hidden") &&
		    $(escapeClientId("mainForm:myLocationView:myLocationId")).val() != "")
		{
			if (urlParams && urlParams.t && urlParams.p)
			{
				locationOrders(urlParams.p);
			}
			else
			{
				locationOrders(1);
			}
		}
	});
	
	$(escapeClientId("mainForm:myProfileOrdersTab")).on("displayTab", function(e)
	{
		if ($("#myProfileOrders").is(":hidden"))
		{
			if (urlParams && urlParams.t && urlParams.p)
			{
				myProfileOrders(urlParams.p);				
			}
			else
			{
				myProfileOrders(1);				
			}
		}
	});
	
	if ($(escapeClientId("mainForm:relatedOrders")).find("tbody tr").length > 0)
	{
		$(escapeClientId("mainForm:relatedOrders")).addClass("recallCheck");
		
		$(escapeClientId("mainForm:relatedOrders")).find("tbody tr").bind("click", function()
		{
			$(this).find("img.busy").show();
			openOrder($(this).find("td:eq(1)").html());
			return false;
		});		
	}	
		
	if (urlParams && urlParams.t && urlParams.p)
	{
		if (urlParams.t == "2")
		{
			$("div.tabs li").eq(1).find("a").trigger("click");
		}
		else if (urlParams.t == "3")
		{
			$("div.tabs li").eq(2).find("a").trigger("click");
		}
		else
		{
			$("div.tab").eq(0).show();			
			$("div.tab").eq(0).trigger("displayTab");			
		}
	}
	else
	{
		$("div.tab").eq(0).show();			
		$("div.tab").eq(0).trigger("displayTab");
	}
	
//	$("#locationOrders a.ie6FirstPage").on("click", function()
//	{
//		
//	});
});

/**
 * Search for a work order from the find work order section. If a work order
 * is found then switch to the work order details page otherwise display a
 * message indicating the work order was not found.
 * 
 * @param wonum  Work order to find.
 */
function findOrder(wonum)
{
	closeMessages("#woSearchMessages");
	clearMessages("#woSearchMessages");	
	
	$("#findWoButton").hide();
	$("#findingWo").show();
	
	var showWo = false;
	
	$.getJSON(root + "selfserve/wolookup.jsf?search=" + encodeURIComponent(wonum), function(data) 
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
				showWo = data.Found;
			}
			else
			{
				showMessage("Work Order does not exist.", "#woSearchMessages");
			}
		})
		.fail(function()
		{
			showMessage("Error looking up Work Order.", "#woSearchMessages");
		})
		.always(function() 
		{
			if (!showWo)
			{
				$("#findWoButton").show();
				$("#findingWo").hide();
				showMessage("Work Order not found.", "#woSearchMessages");
			}
			else
			{
				switchToUrl("selfserve/workorder.jsf?w=" + encodeURIComponent(wonum) + "&p=" + new Date().getTime());		
			}
		});
}

/**
 * Open an order and switch to the work order details page.
 * 
 * @param wonum  Work order number.
 */
function openOrder(wonum, tab)
{		
	$.getJSON(root + "selfserve/wolookup.jsf?t=" + tab + "&search=" + encodeURIComponent(wonum), function(data) 
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
			showMessage("Error looking up Work Order.", "#woSearchMessages");
		})
		.always(function() 
		{
			switchToUrl("selfserve/workorder.jsf?w=" + encodeURIComponent(wonum) + "&p=" + new Date().getTime());		
		});	
}

/**
 * Lookup and display the work orders for the current user.
 * 
 * @param page  Page number of the orders to display.
 */
function myOrders(page)
{
	$("#myOrders").displayResults(
	{
		url: url = root + "selfserve/mywolookup.jsf?",
		page: page,
		recordName: "Work Orders",
		rowClass: "clickable",
		columnBefore: true,
		columnBeforeHtml: "<a href='#'>View</a><img class='notShown busy' src='" + root + "images/busy-small.gif' />",
		errorMsg: "There was a problem searching Work Orders",
		onAfter: function(resultData, resultData2)
		{
			if ($("#myOrders table.results tbody tr").length > 0)
			{
				$("#myOrders table.results img.notShown.busy").hide().removeClass("notShown");
				
				$("#myOrders table.results tbody tr").bind("click", function()
				{
					$(this).find("img.busy").show();
					openOrder($(this).find("td:eq(2)").html(), 1);
					return false;
				});
				
				$("#myOrders table.results a").bind("click", function()
				{
					$(this).parent().parent().trigger("click");
				});
			}
		}
	});	
}

/**
 * Lookup and display the work orders for the current location.
 * 
 * @param page  Page number of the orders to display.
 */
function locationOrders(page)
{
	$("#locationOrders").displayResults(
	{
		url: root + "selfserve/locationwolookup.jsf?",
		page: page,
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
				
				$("#locationOrders table.results tbody tr").bind("click", function()
				{
					$(this).find("img.busy").show();
					openOrder($(this).find("td:eq(2)").html(), 2);
					return false;
				});
				
				$("#locationOrders table.results a").bind("click", function()
				{
					$(this).parent().parent().trigger("click");
				});
			}
		}
	});
	
	$("#locationOrders2").displayResults(
	{
		url: root + "selfserve/locationwolookup.jsf?",
		page: page,
		recordName: "Work Orders",
		rowClass: "clickable",
		columnBefore: true,
		columnBeforeHtml: "<a href='#'>View</a><img class='notShown busy' src='" + root + "images/busy-small.gif' />",
		errorMsg: "There was a problem searching Work Orders"
	});		
}

/**
 * Lookup and display the work orders for the current user's location profile.
 * 
 * @param page  Page number of the orders to display.
 */
function myProfileOrders(page)
{
	$("#myProfileOrders").displayResults(
	{
		url: root + "selfserve/myprofilewolookup.jsf?",
		page: page,
		recordName: "Work Orders",
		rowClass: "clickable",
		columnBefore: true,
		columnBeforeHtml: "<a href='#'>View</a><img class='notShown busy' src='" + root + "images/busy-small.gif' />",
		errorMsg: "There was a problem searching Work Orders",
		onAfter: function(resultData, resultData2)
		{
			if ($("#myProfileOrders table.results tbody tr").length > 0)
			{
				$("#myProfileOrders table.results img.notShown.busy").hide().removeClass("notShown");
				
				$("#myProfileOrders table.results tbody tr").bind("click", function()
				{
					$(this).find("img.busy").show();
					openOrder($(this).find("td:eq(2)").html(), 3);
					return false;
				});
				
				$("#myProfileOrders table.results a").bind("click", function()
				{
					$(this).parent().parent().trigger("click");
				});
			}
		}
	});	
}

/**
 * Lookup and display the log notes for the current work order.
 */
function logNoteSearch()
{
	$("#woLogNotes").displayResults(
	{
		url: root + "selfserve/lognotelookup.jsf?search=",
		recordName: "Log Notes",
		columnAfter: true,
		errorMsg: "There was a problem searching Log Notes",
		onAfter: function(resultData, resultData2)
		{
			var index;
			var html;
			var rowClass;
			
			for (var i = resultData.records.length - 1; i >= 0; i--)
			{
				if (resultData.records[i].hasLd &&
					resultData.records[i].description != resultData.records[i].longDescription)
				{
					index = i;
					html = "<a href='#' class='toggleLongDesc button2'>More</a>";
					
					if (i == 0 || (i % 2) == 0)
					{
						rowClass = "longDescription notShown";
					}
					else
					{
						rowClass = "longDescription even notShown";
					}
					
					$("#woLogNotes table.results tbody tr").eq(index).find("td").eq(3).html(html);
					
					html = "<tr class='" + rowClass + "'><td colspan='2'><div></div></td>" +
					        "<td colspan='2'><div>" + 
					        resultData.records[i].longDescription +
					        "</div></td></tr>";
					
					$("#woLogNotes table.results tbody tr").eq(index).after(html);						
				}
			}
			
			$("#woLogNotes table.results tr.notShown div").hide();
			$("#woLogNotes table.results tr.notShown").hide().removeClass("notShown");
			
			$("#woLogNotes table.results a.toggleLongDesc").on("click", function()
			{					
				if ($(this).text() == "More")
				{
					$(this).text("Less");
					$(this).closest("tr").next().show().find("div").slideToggle("slow");
				}
				else
				{
					$(this).text("More");						
					$(this).closest("tr").next().find("div").slideToggle("slow");
					$(this).closest("tr").next().slideToggle("slow");
				}
				
				return false;
			});			
		},
		onDisplay: function()
		{
			$("#woLogNotes div.busy").hide();
			
			if ($("#woLogNotes table.results tbody tr").length > 0)
			{
				$("#woLogNotes table.results").slideDown();				
			}
			else
			{
				$("p.noneFound").slideDown();
			}	
		}
	});	
}

/**
 * Lookup and display the surveys for the current work order.
 */
function surveySearch()
{
	$("#surveys").displayResults(
	{
		url: root + "selfserve/wosurveylookup.jsf?t=1&search=",
		recordName: "Surveys",
		rowClass: "clickable",
		errorMsg: "There was a problem searching Surveys",
		onAfter: function(resultData, resultData2)
		{		
			$("#surveys table.results tbody tr").on("click", function()
			{
				openUrl($(this).find("td").eq(2).find("a").attr("href"));				
				return false;
			});

			$("#surveys table.results tbody tr").each(function (i, row)
			{
				var link = $(row).find("td").eq(2).text();
				$(row).find("td").eq(2).html("<a href='" + link + "' target='_blank'>Link</a>");
			});
			
			$("#surveys table.results a").on("click", function()
			{
				$(this).parent().parent().trigger("click");
				return false;
			});			
			
			if (resultData.records.length > 0)
			{
				$("#surveys p.summary").text("These are the surveys available for this Work Order. Click on a link or a row to open the survey.");				
			}
			
			$("#surveys p.summary").show();
		}
	});	
}

/**
 * Validate the recall form.
 * 
 * @returns True if valid otherwise false.
 */
function validateRecall()
{
	var valid = true;
	var selector;
	var fieldName;
	var value;
	
	var submitMessagesId = escapeClientId("mainForm:submitMessages");
	var messagesId = "#woRecallMessages";
		
	closeMessages(messagesId);
	clearMessages(messagesId);
	
	closeMessages(submitMessagesId);
	clearMessages(submitMessagesId);
	
	$("#recallTab label.required").each(function()
	{
		value = $(this).children("span:first").text();
		
		if ($.trim(value) == "*")
		{
			selector = escapeClientId($(this).attr("for"));
			value = $(selector).val().trim();
			
			if ($(selector).hasClass("defaultText"))
			{
				value = "";
			}
			
			if (value == "")
			{
				valid = false;
				fieldName = $(this).clone().children().remove().end().text();
				addMessage(fieldName + " is required", messagesId, false);
				$(this).addClass("error");
			}
			else
			{
				$(this).removeClass("error");
			}
		}
	});
	
	if (valid)
	{
		if ($(escapeClientId("mainForm:relatedOrders")).hasClass("recallCheck"))
		{
			valid = false;
			addMessage("Check Related Work Orders", messagesId, true);
			addMessage("Please check the related orders in the Details tab and if you are sure you want to recall this order then please click on Recall again.", messagesId, false);
			$(escapeClientId("mainForm:relatedOrders")).removeClass("recallCheck");
		}
	}
	
	if (valid)
	{
		$(messagesId).hide();
		$(escapeClientId("mainForm:recallButton")).hide();
		$("#recallingWo").show();
	}
	else
	{
		showMessages(messagesId);
	}
	
	return valid;
}

/**
 * Validate the chase form.
 * 
 * @returns True if valid otherwise false.
 */
function validateChase()
{
	var valid = true;
	var selector;
	var fieldName;
	var value;
	
	var submitMessagesId = escapeClientId("mainForm:submitMessages");
	var messagesId = "#woChaseMessages";
		
	closeMessages(messagesId);
	clearMessages(messagesId);
	
	closeMessages(submitMessagesId);
	clearMessages(submitMessagesId);
	
	$("#chaseTab label.required").each(function()
	{
		value = $(this).children("span:first").text();
		
		if ($.trim(value) == "*")
		{
			selector = escapeClientId($(this).attr("for"));
			value = $(selector).val().trim();
			
			if ($(selector).hasClass("defaultText"))
			{
				value = "";
			}
			
			if (value == "")
			{
				valid = false;
				fieldName = $(this).clone().children().remove().end().text();
				addMessage(fieldName + " is required", messagesId, false);
				$(this).addClass("error");
			}
			else
			{
				$(this).removeClass("error");
			}
		}
	});
	
	if (valid)
	{
		$(messagesId).hide();
		$(escapeClientId("mainForm:chaseButton")).hide();
		$("#chasingWo").show();
	}
	else
	{
		showMessages(messagesId);
	}
	
	return valid;
}
