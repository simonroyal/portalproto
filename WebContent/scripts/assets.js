$(document).ready(function ()
{			
	$("div.tabs li a").bind("click", function()
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
	
	$("p.switchedLocationEvent").on("switchedLocationHandler", function(e, eventInfo)
	{
		$(this).text("These are the assets against location " + eventInfo);				
	});	
	
	$("div.switchedLocationEvent").on("switchedLocationHandler", function(e, eventInfo)
	{
		var current = $("div.tabs li.selected").index();
		
		if ($("div.tab").eq(current).attr("id") == "locationAssetsTab")
		{
			$("#locationAssets").displayResults(
			{
				url: root + "siteuser/locationassetlookup.jsf?",
				recordName: "Assets",
				onError: function() { showMessage("There was a problem searching for assets.", "#locationAssetsMessages"); }
			});	
		}
		else
		{
			$("#locationAssets").hide();
		}
	});
	
	$("#locationAssetsTab").on("displayTab", function(e)
	{
		if ($("#locationAssets").is(":hidden"))
		{
			$("#locationAssets").displayResults(
			{
				url: root + "siteuser/locationassetlookup.jsf?",
				recordName: "Assets",
				onError: function() { showMessage("There was a problem searching for assets.", "#locationAssetsMessages"); }
			});	
		}		
	});
	
	$("#profileAssetsTab").on("displayTab", function(e)
	{
		if ($("#myProfileAssets").is(":hidden"))
		{
			$("#myProfileAssets").displayResults(
			{
				url: root + "siteuser/myprofileassetlookup.jsf?",
				recordName: "Assets",
				onError: function() { showMessage("There was a problem searching for assets.", "#myProfileAssetsMessages"); }
			});
		}
	});
	
	$("#locationAssetsTab").trigger("displayTab");
});
