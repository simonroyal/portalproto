$(document).ready(function ()
{	
	$("#problemSelected a.switch").on("click", function()
	{
		$("#par").hide();
		$(escapeClientId("mainForm:problem")).val("");
		$(this).parent().hide();
		$(escapeClientId("mainForm:problemSearch")).show();
		$(escapeClientId("mainForm:problemSearch")).autocomplete("search");
		parOrders();
		return false;
	});
	
	$("div.switchedLocationEvent").on("switchedLocationHandler", function(e, locationData)
	{
		checkProfile();
	});	
	
	if ($(escapeClientId("mainForm:problem")).val() != "")
	{
		$(escapeClientId("mainForm:problemSearch")).hide();
		$(escapeClientId("mainForm:problemSelectedDescription")).val($(escapeClientId("mainForm:problemSearch")).val());
		$("#problemSelected").show();
	}

	$.getJSON(root + "selfserve/repairslookup.jsf", function(data) 
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
				$.data($("#page")[0], "repairs", data);
				
				if (data.length == 0)
				{
					setProblemAutocomplete(data);
				}
				else
				{
					checkProfile();
				}
			}
			else
			{
				//showMessage("There was a problem searching the service profile.", "#locationSearchMessages");				
			}
		})
		.fail(function()
		{
			//showMessage("There was a problem searching service profile.", "#locationSearchMessages");				
		})
		.always(function() 
		{
		});

	// Setup the dialog boxes and setting of the form to be read only
	// when health and safety is checked.	
	
	$("input[name='isHns']").change(function()
	{		
		if ($(this).is(":checked") && $(this).val() == "true")
		{
			toggleReadOnly("isHns", true);
			
			$("#dialogHns").dialog(
			{
				modal: true,
				resizable: false,
				buttons: { Ok: function() { $(this).dialog("close");} }
			});
		}
		else if ($(this).is(":checked") && $(this).val() == "false")
		{
			toggleReadOnly("isHns", false);
		}
	});
	
	// Setup the dialog boxes and setting of the form to be read only
	// when trading is checked.
	
	$("input[name='isTrading']").change(function()
	{		
		if ($(this).is(":checked") && $(this).val() == "true")
		{
			toggleReadOnly("isTrading", true);
					
			$("#dialogTrading").dialog(
			{
				modal: true,
				resizable: false,
				buttons: { Ok: function() { $(this).dialog("close");} }
			});
		}
		else if ($(this).is(":checked") && $(this).val() == "false")
		{
			toggleReadOnly("isTrading", false);							
		}
	});
	
	// Setup the dialog boxes when insurance is checked.
	
	$("input[name='isInsurance']").change(function()
	{		
		if ($(this).is(":checked"))
		{
			$(escapeClientId("mainForm:isInsurance")).val($(this).val());
			
			if ($(this).val() == "true")
			{
				$("#dialogInsurance").dialog(
				{
					modal: true,
					resizable: false,
					buttons: { Ok: function() { $(this).dialog("close");} }
				});				
			}				
		}
	});	
	
	if (!($("#div.problemSelected").is(":hidden")))
	{
		$("input[name='isHns']").prop("checked", false);
		$("input[name='isTrading']").prop("checked", false);
		$("input[name='isInsurance']").prop("checked", false);	
		
		$(escapeClientId("mainForm:problem")).val("");
		$(escapeClientId("mainForm:problemSearch")).val("");
		$("#problemSelected").hide();
		$(escapeClientId("mainForm:problemSearch")).show();
		$(escapeClientId("mainForm:longDescription")).val("");
	}	
});

/**
 * Toggle the ability to submit or change any field.
 * 
 * @param from      Check box that triggered the event.
 * @param readOnly  Whether or not the form is to be made read only.
 */
function toggleReadOnly(from, readOnly)
{
	// The read only class is generally only needed for older IE browsers.
	
	$("div.section fieldset select").prop("readonly", readOnly);
	$("div.section fieldset textarea").prop("readonly", readOnly);
		
	$("div.section fieldset input[type=text]").each(function()
	{
		if ($(this).attr("id") != "mainForm:problemSelectedDescription")
		{
			$(this).prop("readonly", readOnly);
			
			if (readOnly)
			{
				$(this).addClass("readonly");
			}
			else
			{
				$(this).removeClass("readonly");				
			}
		}
	});	
	
	if (readOnly)
	{
		$("div.section fieldset select").addClass("readonly");
		$("div.section fieldset textarea").addClass("readonly");
		
		$("div.section fieldset input[type=checkbox]").each(function()
		{
			if ($(this).attr("id") != from)
			{
				$(this).prop("disabled", true);
				$(this).addClass("noChange");				
			}				
		});

		$("div.section fieldset input[type=radio]").each(function()
		{
			if ($(this).attr("name") != from)
			{
				$(this).prop("disabled", true);
				$(this).addClass("noChange");				
			}				
		});
		
		$(escapeClientId("mainForm:submitButton")).hide();
	}
	else
	{
		$("div.section fieldset select").removeClass("readonly");
		$("div.section fieldset textarea").removeClass("readonly");		
		$("div.section fieldset input[type=checkbox]").removeClass("noChange");		
		$("div.section fieldset input[type=checkbox]").prop("disabled", false);		
		$("div.section fieldset input[type=radio]").removeClass("noChange");		
		$("div.section fieldset input[type=radio]").prop("disabled", false);		
		$(escapeClientId("mainForm:submitButton")).show();	
	}
}

/**
 * Set the repairs associated with the problem to the search auto complete.
 * 
 * @param repairs  The array repairs to set.
 */
function setProblemAutocomplete(repairs)
{
	$(escapeClientId("mainForm:problemSearch")).autocomplete(
	{ 
		minlength: 3,
		source: repairs,
		select: function(event, ui)
		{
			// Lock in the selected repair type and populate the description
			// with the repair type questions (if some exist).
			
			$(escapeClientId("mainForm:problem")).val(ui.item.id);
			$(escapeClientId("mainForm:problemSearch")).val(ui.item.label);
			$(escapeClientId("mainForm:problemSelectedDescription")).val(ui.item.label);
			$(escapeClientId("mainForm:problemSearch")).hide();
			$("#problemSelected").show();

			$(escapeClientId("mainForm:longDescription")).val("");
			
			if (ui.item.questions.length > 0)
			{
				var description = "";
				
				for (var i = 0; i < ui.item.questions.length; i++)
				{
					description += ui.item.questions[i] + "?\n\n";
				}
				
				$(escapeClientId("mainForm:longDescriptionBackup")).val(description);				
				$(escapeClientId("mainForm:longDescription")).val(description);
			}
			
			parOrders();
	        return false;
		}						
	});	
}

/**
 * Check which repair types can be used for the current location.
 */
function checkProfile()
{	
	var repairs = $.data($("#page")[0], "repairs");
	var selected = $(escapeClientId("mainForm:problem")).val();
	
	// Lookup the repairs that are not allowed for the current location.
	
	$.getJSON(root + "selfserve/denyrepairslookup.jsf", function(data) 
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
				var valid = [];
				var include;
				
				// If there are none to deny then simply use the full array.
				
				if (data.length == 0)
				{
					valid = repairs;
				}
				else
				{
					// Loop through the repair and deny arrays and only include
					// the repairs that are not in the deny array.
					
					// If the current selected repair is in the deny array then
					// we need to clear the value and trigger another search.
					
					for (var i = 0; i < repairs.length; i++)
					{
						include = true;
						
						for (var j = 0; include && j < data.length; j++)
						{
							if (repairs[i].id == data[j].id)
							{
								include = false;
								
								if (selected == data[j].id)
								{
									$(escapeClientId("mainForm:problemSearch")).val("");
									$("#problemSelected a.switch").trigger("click");
								}
							}
						}
						
						if (include)
						{
							valid.push(repairs[i]);
						}
					}					
				}
				
				setProblemAutocomplete(valid);
			}
			else
			{
				//showMessage("There was a problem searching the service profile.", "#locationSearchMessages");				
			}
		})
		.fail(function()
		{
			//showMessage("There was a problem searching service profile.", "#locationSearchMessages");				
		})
		.always(function() 
		{
			parOrders();
		});
}

/**
 * Display the problem already reported work orders for the current location.
 */
function parOrders()
{
	if ($(escapeClientId("mainForm:myLocationView:myLocationId")).val().trim() != "" &&
		$(escapeClientId("mainForm:problem")).val().trim() != "")
	{
		$("#parHelp").html(
				"<p>These orders are open for the same problem type you selected at your location. " +
				"Please review before raising a new request.</p><p>It will be assumed this is not a duplicate order if you progress.</p>");
		
		$("#parOrders").displayResults(
		{
			url: root + "selfserve/parlookup.jsf?rt=" + encodeURIComponent($(escapeClientId("mainForm:problem")).val().trim()),
			recordName: "Work Orders",
			errorMsg: "There was a problem searching for Work Orders.",
			onAfter: function(resultData, resultData2)
			{
				var index;
				var html;
				var rowClass;
						
				for (var i = resultData.records.length - 1; i >= 0; i--)
				{
					if (resultData.records[i].hasLd)
					{
						index = i;
						html = "<a href='#' class='toggleLongDesc lookupData button2'>More</a>";
								
						if (i == 0 || (i % 2) == 0)
						{
							rowClass = "longDescription notShown";
						}
						else
						{
							rowClass = "longDescription even notShown";
						}
								
						$("#parOrders table.results tbody tr").eq(index).find("td").eq(3).html(html);
							
						html = "<tr class='" + rowClass + "'><td colspan='2'><img class='busy' src='" +
						        root + "images/busy-small.gif' /></td>" +
						        "<td colspan='3'><div></div></td></tr>";
								
						$("#parOrders table.results tbody tr").eq(index).after(html);						
					}
				}
						
				$("#parOrders table.results tr.notShown div").hide();
				$("#parOrders table.results tr.notShown").hide().removeClass("notShown");
						
				// Toggle the detailed description row. When revealing the row,
				// if the data has not already been looked up then a call
				// will be made to get the data.
				
				$("#parOrders table.results a.toggleLongDesc").on("click", function()
				{
					if ($(this).text() == "More")
					{
						$(this).text("Less");
						
						if ($(this).hasClass("lookupData"))
						{
							$(this).closest("tr").next().show();							
							lookupLongDescription($(this).parent().parent());
						}
						else
						{
							$(this).closest("tr").next().show().find("div").slideToggle("slow");						
						}
					}
					else
					{
						$(this).text("More");			
						$(this).closest("tr").next().find("div").slideToggle("slow");
						$(this).closest("tr").next().slideToggle("slow");
					}
					
					return false;
				});			
			}		
		});		
	}
	else
	{
		$("#parHelp").html("When a similar problem has already been reported at your location a list of open orders will be displayed - please check these before proceeding to log the order.");
		$("#parOrders").hide();
	}
}

/**
 * Lookup the long description for a work order in the PAR results table.
 * 
 * @param row  The row of the work order.
 */
function lookupLongDescription(row)
{
	$(row).find("a.lookupData").removeClass("lookupData");	

	$.getJSON(root + "selfserve/wolookup.jsf?ld=1&search=" + encodeURIComponent($(row).find("td").eq(1).html()), function(data) 
	{					
	})
		.done(function(data)
		{
			if (data && data.login)
			{
				switchToUrl(loginUrl);
			}
			else if (data && data.longDescription)
			{
				// Display the description found and remove the busy icon.
				
				$(row).next().find("div").html("<pre>" + data.longDescription + "</pre>");
				$(row).next().find("div").slideToggle("slow");
				$(row).next().find("img.busy").remove();
			}
			else
			{
				showMessage("There was a problem looking up the detailed description.", "#parOrders div.messages");
			}
		})
		.fail(function()
		{
			showMessage("There was a problem looking up the detailed description.", "#parOrders div.messages");
		})
		.always(function() 
		{
		});
}

/**
 * Check the new order form is valid.
 * 
 * @returns True if valid otherwise false.
 */
function validateOrder()
{
	return validateForm("mainForm:submitMessages", "Unable to submit the work order");	
}

/**
 * Validate a form.
 * 
 * @param target        Messages target ID.
 * @param titleMessage  Message title to display (if invalid).
 * 
 * @returns True if valid otherwise false.
 */
function validateForm(target, titleMessage)
{
	var valid = true;
	var selector;
	var fieldName;
	var value;	
	var messagesId = escapeClientId(target);
	
	closeMessages(messagesId);
	clearMessages(messagesId);
	addMessage(titleMessage, messagesId, true);
	
	// Go through each field label that is marked as required and check that a
	// value has been entered. If not then highlight the label and add a message
	// indicating the field is required.
	
	$("label.required").each(function()
	{		
		if ($(this).children("span:first").text() == "*")
		{
			// The actual problem field is hidden so the problem search
			// label is switched to look at the hidden field.
			
			if ($(this).hasClass("radio"))
			{
				selector = "input[name='" + $(this).attr("for") + "']:checked";
				value = "";
				
				if ($(selector).length > 0)
				{
					value = "true";
				}
			}
			else
			{
				if ($(this).attr("for") == "mainForm:problemSearch")
				{
					selector = escapeClientId("mainForm:problem");
				}
				else
				{
					selector = escapeClientId($(this).attr("for"));				
				}
				
				value = $(selector).val().trim();
				
				if ($(selector).hasClass("defaultText"))
				{
					value = "";
				}				
			}			
			
			// If checking the long description then compare it to the backup
			// to see if the user has entered anything above the pre-populated
			// questions.
			
			if (value != "" && $(this).attr("for") == "mainForm:longDescription" &&
				value.trim() == $(escapeClientId("mainForm:longDescriptionBackup")).val().trim())
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
	
	if ($(escapeClientId("mainForm:myLocationView:myLocationId")).val().trim() == "")
	{
		valid = false;
		addMessage("Current location not set", messagesId, false);
	}
	
	$(escapeClientId("mainForm:longDescriptionBackup"));
	
	
		
	if (valid)
	{
		$(messagesId).hide();
		$(escapeClientId("mainForm:submitButton")).hide();
		$("#submittingWo").show();
	}
	else
	{
		showMessages(messagesId);
	}
	
	return valid;
}
