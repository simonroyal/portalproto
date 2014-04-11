var root = "/mabportalv2/";
var cookiePath = "/mabportalv2";
var loginUrl = "login/default.jsf";
var browserInfo = { ie: false, ieVersion: 0, compatMode: false };

// IE8 and below does not support the trim() method.

if(!String.prototype.trim)
{
	String.prototype.trim = function ()
	{
		return this.replace(/^\s+|\s+$/g,'');
	};
}

$(document).ready(function ()
{
	$.ajaxSetup({ cache: false });
	
	$(".notShown").hide().removeClass("notShown");

	$(".autoDisable").attr("autocomplete", "off");
	
	$("table.results tbody tr:visible:odd").addClass("even");
	
	$(".messages.clickable").on("click", function()
	{
		$(this).slideUp();
	});
	
	$(".messages").each(function()
	{
		if ($(this).children().length > 0)
		{
			$(this).show();
		}
	});
	
	$(".defaultText").on("focus", function()
	{
		if ($(this).val() == $(this)[0].title)
		{
			$(this).removeClass("defaultText");
			$(this).val("");
		}
	});
			
	$(".defaultText").on("blur", function()
	{
		if ($(this).val() == "")
		{
			$(this).addClass("defaultText");
			$(this).val($(this)[0].title);
		}			
	});
			
	$(".defaultText").removeClass("defaultText").blur();
	$("input.defaultFocus:first").focus();
	
	$("fieldset .hasHelp").on("focus", function()
	{
		$(this).parent().find("div.help").show();
	});

	$("fieldset .hasHelp").on("blur", function()
	{
		$(this).parent().find("div.help").hide();
	});
	
	$("span.switchedLocationEvent.description").on("switchedLocationHandler", function(e, locationData)
	{
		$(this).text(locationData.description);
	});	

	$("span.switchedLocationEvent.locationNotSet").on("switchedLocationHandler", function(e, locationData)
	{
		$("span.switchedLocationEvent.locationNotSet").contents().filter(function()
		{
			return this.nodeType == 8;
	    })
	    .each(function(i, e)
	    {
	    	$("span.switchedLocationEvent.locationNotSet").html(e.nodeValue);
	    	$("span.switchedLocationEvent.locationNotSet").removeClass("switchedLocationEvent locationNotSet");
	    });
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
	
	
	browserInfo.ieVersion = ieVersion();

	if (browserInfo.ieVersion > 0)
	{
		browserInfo.ie = true;
		
		if (document.documentMode && document.documentMode != browserInfo.ieVersion)
		{
			browserInfo.compatMode = true;
			browserInfo.ieVersion = document.documentMode;
		}
	}	
	
	if (browserInfo.ie && browserInfo.compatMode && !$.cookie("ieCompatMode.ok"))
	{
		var ieWarningHtml = "<div id='ieWarning' class='notShown'><h2>Old Browser</h2>" +
			"<a href='#'>Close</a><input id='ignoreIeWarning' type='checkbox' name='ignoreIeWarning' />" +
			"<label for='ignoreIeWarning'>Don't remind me again</label>" +
			"<p>You are using an old IE browser that this website does not support.</p>" +
			"<p>This site has not been checked that it works your browser so whilst some pages may work, " +
			"some areas may also fail to work or behave in an unexpected way.</p></div>";
		
		if (browserInfo.compatMode)
		{
			ieWarningHtml = "<div id='ieWarning' class='notShown'><h2>IE Compatiblity Mode</h2>" +
				"<a href='#'>Close</a><input id='ignoreIeWarning' type='checkbox' name='ignoreIeWarning' />" +
				"<label for='ignoreIeWarning'>Don't remind me again</label>" +
				"<p>You are displaying this website in IE using compatiblity mode.</p>" +
				"<p>Compatibility mode is not required and some areas may also fail to work or behave in " +
				"an unexpected way. It is advised to disable compatiblity mode for this URL.</p></div>";			
		}
		
		$("#page").children().first().before(ieWarningHtml);		
		$("#ieWarning").hide().removeClass("notShown");
		
		$("#ieWarning a").on("click", function()
		{
			var ieCookieName = "ie6.ok";
			
			if (browserInfo.compatMode)
			{
				ieCookieName = "ieCompatMode.ok";
			}
			
			if ($("#ignoreIeWarning").is(":checked"))
			{
				$.cookie(ieCookieName, "1", { expires: 100, path: cookiePath });
			}
			else
			{
				$.cookie(ieCookieName, "1", { path: cookiePath });				
			}

			$(this).parent().slideToggle();
			return false;
		});
		
		$("#ieWarning").slideToggle();		
	}
});

/**
 * Get the version of IE used.
 * 
 * @returns The version number of IE or 0 if not IE.
 */
function ieVersion()
{
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf( "MSIE " );
	
	if (msie > 0)
	{
         return parseInt(ua.substring (msie + 5, ua.indexOf (".", msie)));			
	}
	else
	{
         return 0;			
	}
}

/**
 * Convert a JSF ID (view:field) into a JQuery ID.
 * 
 * @param id  JSF ID to convert.
 * 
 * @returns {String}
 */
function escapeClientId(id)
{
	return "#" + id.replace(/:/g,"\\:");
}

/**
 * Clear any fields that contain help text.
 */
function clearHelpText()
{
	$(".defaultText").val("");
}

/**
 * Clear messages from a messages div.
 * 
 * @param target  ID of the messages to clear.
 */
function clearMessages(target)
{
	$(target).children("span").remove();
}

/**
 * Add a message to an existing list of messages.
 * 
 * @param message  Message to add.
 * @param target   Target selector.
 * @param title    True if the message is the title.
 */
function addMessage(message, target, title)
{
	var toAdd;
	
	if (title)
	{
		toAdd = '<span class="title">' + message + '</span>';				
	}
	else
	{
		toAdd = "<span>" + message + "</span>";		
	}
	
	$(target).append(toAdd);
}

/**
 * Display a single message in an existing messages box.
 * 
 * @param message  Message to show.
 * @param target   Message selector.
 */
function showMessage(message, target)
{
	clearMessages(target);
	addMessage(message, target, false);
	showMessages(target);
}

/**
 * Show the messages box.
 * 
 * @param target  Message box selector.
 */
function showMessages(target)
{	
	$(target).fadeIn();
}

/**
 * Hide a messages box.
 * 
 * @param target  Message box selector.
 */
function closeMessages(target)
{
	$(target).fadeOut();
}

/**
 * Open another URL in the same window. The URL does not need to include the root.
 * 
 * @param url  The URL to switch to (excluding the protocol, host and root).
 */
function switchToUrl(url)
{
	window.open(window.location.protocol + "//" + window.location.hostname + root + url, "_self", "", false);				
}

/**
 * Open an external URL in a new window.
 * 
 * @param url  The URL to open.
 */
function openUrl(url)
{
	window.open(url, "_blank", "", false);				
}

/**
 * Turn the query string into an array of key value pairs.
 * 
 * @returns The query string parameters.
 */
function getUrlParams()
{
    var match;
    var pl     = /\+/g;  // Regex for replacing addition symbol with a space
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    var query  = window.location.search.substring(1);
    var urlParams = {};
    
    while (match = search.exec(query))
    {    	
    	urlParams[decode(match[1])] = decode(match[2]);	
    }
    
    return urlParams;
}
