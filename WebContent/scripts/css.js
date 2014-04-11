$(document).ready(function ()
{		
	$.getJSON(root + "csslookup.jsf", function(data) 
	{
	})
		.success(function(data)
		{
			if (data && data.files)
			{
				var files = $("ul.files");
				
				for (var i = 0; i < data.files.length; i++)
				{
					files.append("<li><a target='_blank' href='" + data.files[i].url + "'>" + data.files[i].filename + "</a></li>");
				}
				
				if (data.files.length == 0)
				{
					$(files).append("<li>There are no files available.</li>");
				}				
				
				$("ul.files").show();
			}
			else
			{
				showMessage("There was a problem searching the documents.", "#cssMessages");
			}
		})
		.error(function()
		{
			showMessage("There was a problem searching the documents.", "#cssMessages");
		})
		.complete(function() 
		{
			$("div.busy").hide();
		});		
});
