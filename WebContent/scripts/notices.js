$(document).ready(function ()
{
	$("#noticeContainer").hide();
	$("#notices p").hide();
	$("#noticesBusy").show();
	
	$("#notices input.previousPage").on("click", function()
	{
		$("#noticeContainer").cycle("prev");
	});

	$("#notices input.nextPage").on("click", function()
	{
		$("#noticeContainer").cycle("next");
	});
	
	$.getJSON(root + "/notificationlookup.jsf", function(data) 
	{					
	})
		.done(function(data)
		{
			if (data)
			{					
				$("#noticeContainer > div").remove();

				for (var i = 0; i < data.records.length; i++)
				{
					$("#noticeContainer").append(
							"<div class='notice'><span class='subject'>" + data.records[i].subject + "</span>" +
						    "<p>" + data.records[i].message + "</p>" +
						    "</div>");
				}
				
				$("#notices > p").text("There are no notices at this time.");
			}
			else
			{
				$("#noticeContainer div").remove();
				$("#notices > p").text("There was a problem retrieving the notices.");
			}
		})
		.fail(function()
		{
			$("#noticeContainer div").remove();
			$("#notices > p").text("There was a problem retrieving the notices.");
		})
		.always(function() 
		{
			$("#noticesBusy").hide();

			if ($("#noticeContainer > div").length > 0)
			{
				$("#noticeContainer").show();
				
				if ($("#noticeContainer > div").length > 1)
				{
					$("#noticeContainer").cycle();	
					$("#notices input.previousPage").show();
					$("#notices input.nextPage").show();
				}
			}
			else
			{
				$("#notices > p").show();
			}
		});
	
	$("#noticeContainer").hover
	(
		function()
		{
			if ($("#noticeContainer > div").length > 1)
			{
				$("#notices div.paused").show();				
			}
		},
		function()
		{
			if ($("#noticeContainer > div").length > 1)
			{
				$("#notices div.paused").hide();				
			}
		}
	);				
});
