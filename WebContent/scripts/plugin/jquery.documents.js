$(document).ready(function ()
{	
});

(function ($)
{
	function listFolderFiles(obj, filename)
	{
		var url = root + "siteuser/documentlookup.jsf?";
		
		if (filename && filename != "")
		{
			url += "search=" + encodeURIComponent(filename);
		}
		
		$(obj).show();
		$(obj).find("div.busy").show();
		$(obj).find("ul.folders > li").remove();
		
		$.getJSON(url, function(result) 
		{
		})
			.success(function(result)
			{
				if (result && result.login)
				{
					switchToUrl(loginUrl);
				}
				
				if (result && result.folders)
				{
					$(obj).find("p.summary").text("Found " + result.fileCount + " files.");
					
					if (result.fileCount > 0)
					{
						var tableHtml = "<div class='files notShown'><table class='results'><thead><th></th><th>File</th><th>Description</th><th class='date'>Created On</th></thead><tbody></tbody></table></div>";
						var list = $(obj).find("ul.folders");
						var body;
						var link;
						var rowClass;
						
						for (var i = 0; i < result.folders.length; i++)
						{
							$(list).append(
								"<li class='collapsed'><a href='" +
								result.folders[i].name + "' class='folder'>" +
							    result.folders[i].description +
							    "</a>" + tableHtml + "</li>");

							body = $(obj).find("ul.folders li").eq(i).find("table tbody");
							
							for (var j = 0; j < result.folders[i].files.length; j++)
							{
								if (result.folders[i].files[j].url && result.folders[i].files[j].url.length > 0)
								{
									rowClass = " class='clickable'";
									link = "<a href='" + result.folders[i].files[j].url + "' class='file' target='_blank'>Open</a>";
								}
								else
								{
									rowClass = "";
									link = "";
								}
								
								$(body).append(
										"<tr><td" + rowClass + ">" + link + "</td>" +
										"<td>" + result.folders[i].files[j].filename + "</td>" +
										"<td>" + result.folders[i].files[j].description + "</td>" +
										"<td>" + result.folders[i].files[j].createDate + "</td></tr>");
							}
						}
					}
				}
				else
				{
					var id = $(obj).find("div.messages").attr("id");
					showMessage("There was a problem searching for the documents.", id);					
				}
			})
			.error(function()
			{
				var id = $(obj).find("div.messages").attr("id");
				showMessage("There was a problem searching for the documents.", id);					
			})
			.complete(function()
			{
				$(obj).find("ul.folders li table").each(function()
				{
					$(this).find("tbody tr:odd").addClass("even");
				});
				
				$(obj).find("ul.folders li tr.clickable").bind("click", function()
				{
					window.open($(this).find("a").attr("href"));
				});
				
				$(obj).find("ul.folders li > a.folder").bind("click", function()
				{
					$(this).parent().toggleClass("collapsed");					
					$(this).toggleClass("expanded");			
					$(this).parent().find("div.files").slideToggle();
					return false;
				});

				$(obj).find(".notShown").hide().removeClass("notShown");
				$(obj).find("div.busy").hide();
			});
	};

	$.fn.listFiles = function(filename)
	{
		if ($(this).length > 0)
		{
			listFolderFiles($(this), filename);			
		}
	};
}(jQuery));
