$(document).ready(function ()
{
	$("div.searchResults div.busy").hide();
	$("div.searchResults table.results").hide();
	$("div.searchResults ul.results").hide();
	
	$("div.searchResults").each(function()
	{
		$(this).find(".firstPage").bind("click", function()
		{
			$(this).closest("div.searchResults").gotoFirstPage();
			return false;
		});
		
		$(this).find(".previousPage").bind("click", function()
		{
			$(this).closest("div.searchResults").gotoPreviousPage();
			return false;
		});	
		
		$(this).find(".nextPage").bind("click", function()
		{			
			$(this).closest("div.searchResults").gotoNextPage();
			return false;
		});	
	
		$(this).find(".lastPage").bind("click", function()
		{
			$(this).closest("div.searchResults").gotoLastPage();
			return false;
		});
		
		$(this).find("select.perPage").bind("change", function()
		{
			$(this).closest("div.searchResults").changePageSize($(this).val());
		});
	});
});

(function ($)
{
	function getIeVersion()
	{
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf( "MSIE " );
		
		if (msie > 0)
		{
	         return parseInt(ua.substring (msie+5, ua.indexOf (".", msie )));			
		}
		else
		{
	         return 0;			
		}
	}	

	function showResultMessages(obj, message)
	{
		$(obj).find("div.messages").children("span").remove();
		$(obj).find("div.messages").append("<span>" + message + "</span>");
		$(obj).find("div.messages").fadeIn();
	}
	
	function hideResultMessages(obj)
	{
		$(obj).find("div.messages").fadeOut();
		$(obj).find("div.messages").children("span").remove();		
	}
	
	function performSearch(obj, options)
	{
		var url;
		var cookieName = $(obj).attr("id") + ".perPage";
		var perPage = $.cookie(cookieName);
		var ie = getIeVersion();
		
		if (!perPage)
		{
			perPage = 10;
			$.cookie(cookieName, 10, { expires: 365, path: '/helpdeskonline' });		
		}
				
		if (options.paging)
		{
			$(obj).find("select.perPage").show();
			$(obj).find("select.perPage").val(perPage);
			url = options.url + "&p=" + options.page + "&s=" + perPage;
		}
		else
		{
			$(obj).find("select.perPage").hide();
			url = options.url;			
		}
		
		hideResultMessages(obj);
		
		if ($.isFunction(options.onBefore))
		{
			options.onBefore.call();
		}
		
		if (!options.hide)
		{
			$(obj).show();
		}
		
		$(obj).addClass("searching");		
		$(obj).find("div.busy").show();
		
		if (ie == 6)
		{
			obj.find("div.summary").hide();
			obj.find(".perPage").hide();
			obj.find("div.busy").height(obj.height());
			obj.find("div.busy").width(obj.width());	
			obj.find("div.busy").css({top: 5, left: 0});
		}

		$.getJSON(url, function(data) 
		{
		})
			.done(function(data)
			{
				if (data && data.login)
				{
					switchToUrl(loginUrl);
				}

				if (data && data.records)
				{
					var summary = "";
					var keys = [];
					var values;
					var index;
					var tableOptions = $.data(obj[0], "tableOptions");
					var forward = false;
					var backward = false;

					tableOptions.page = data.page;
					tableOptions.pages = data.pages;
					tableOptions.total = data.total;
					$.data(obj, "tableOptions", tableOptions);
					
					for (var i = 0; i < data.columns.length; i++)
					{
						keys.push(data.columns[i]);
					}					

					if (data.pages > 1)
					{
						summary = "<span>Found " + data.total + 
			                      " " + options.recordName +
			                      ".</span><span>Showing page " +
			                      data.page + " of " +
			                      data.pages + ".</span>"; 
					}
					else
					{
						summary = "<span>Found " + data.total + 
			                      " " + options.recordName + ".</span>";
					}

					obj.find("div.summary").html(summary);
					
					if (tableOptions.layout == 1)
					{
						obj.find("tbody tr").remove();
						
						for (var i = 0; i < data.records.length; i++)
						{
							html = "<tr class='" + options.rowClass + "'>";
							values = [];
							
							for (var j = 0; j < data.columns.length; j++)
							{
								values.push("");
							}

							if (options.columnBefore)
							{
								html += "<td>" + options.columnBeforeHtml + "</td>";
							}
						
							$.each(data.records[i], function(key, value)
							{
								index = $.inArray(key, keys);
								
								if (index > -1)
								{									
									values[index] = value;
								}
							});
							
							html += "<td>" + values.join("</td><td>") + "</td>";
							
							if (options.columnAfter)
							{
								html += "<td>" + options.columnAfterHtml + "</td>";
							}
							
							html += "</tr>";
							
							obj.find("tbody").append(html);
						}						
					}
					else
					{
						obj.find("ul.results li").remove();
						
						for (var i = 0; i < data.records.length; i++)
						{
							html = "<li>";
							values = [];
							
							for (var j = 0; j < data.columns.length; j++)
							{
								values.push("");
							}
							
							if (options.itemIsLink)
							{
								html += "<a href='#'>"; 
							}
							
							$.each(data.records[i], function(key, value)
							{
								index = $.inArray(key, keys);
								
								if (index > -1)
								{									
									values[index] = value;
								}
							});
							
							html += "<span>" + values.join("</span><span>") + "</span>";
							
							if (options.itemIsLink)
							{
								html += "</a>"; 
							}
							
							html += "</li>";
							
							obj.find("ul.results").append(html);
						}
					}
					
					if (tableOptions.paging)
					{
						if (data.page > 1)
						{
							backward = true;
						}
						
						if (data.page < data.pages && data.total > 0)
						{
							forward = true;
						}

						obj.find("input.backward").attr("disabled", !backward);
						obj.find("input.forward").attr("disabled", !forward);
						
						obj.find("input:disabled").addClass("disabled");
						obj.find("input:enabled").removeClass("disabled");
						
						if (backward)
						{
							obj.find("a.backward").removeClass("disabled");
						}
						else
						{
							obj.find("a.backward").addClass("disabled");					
						}

						if (forward)
						{
							obj.find("a.forward").removeClass("disabled");
						}
						else
						{
							obj.find("a.forward").addClass("disabled");						
						}
						
						if (data.pages < 2)
						{
							obj.find(".backward").hide();
							obj.find(".forward").hide();
						}
						else
						{
							obj.find(".backward").show();
							obj.find(".forward").show();
						}
						
						if (data.total == 0)
						{
							obj.find("select.perPage").hide();
						}
						else
						{
							obj.find("select.perPage").show();						
						}
					}
					else
					{
						obj.find(".backward").hide();
						obj.find(".forward").hide();
						obj.find("select.perPage").hide();						
					}					
					
					if (tableOptions.layout == 1)
					{
						obj.find("table.results tbody tr:odd").addClass("even");						
					}
					else
					{
						obj.find("ul.results li:odd").addClass("even");						
					}					
					
					if ($.isFunction(options.onAfter))
					{
						options.onAfter.call(data, data);			
					}
				}
				else
				{
					if ($.isFunction(options.onError))
					{
						options.onError.call();						
					}
					else if (options.errorMsg != "")
					{
						showResultMessages(obj, options.errorMsg);
					}
					else
					{
						showResultMessages(obj, "There was a problem displaying the results.");						
					}
				}
			})
			.fail(function()
			{
				$(obj).find("select.perPage").hide();
				$(obj).find(".backward").hide();
				$(obj).find(".forward").hide();
				
				if ($.isFunction(options.onError))
				{
					options.onError.call();						
				}
				else if (options.errorMsg != "")
				{
					showResultMessages(obj, options.errorMsg);
				}
				else
				{
					showResultMessages(obj, "There was a problem displaying the results.");						
				}
			})
			.always(function()
			{
				var tableOptions = $.data(obj[0], "tableOptions");
				
				if ($.isFunction(options.onDisplay))
				{
					options.onDisplay.call();
				}
				else
				{					
					if (tableOptions.total > 0)
					{
						$(obj).find("table.results").show();
						$(obj).find("ul.results").show();						
					}
					else
					{
						$(obj).find("table.results").hide();
						$(obj).find("ul.results").hide();						
					}
				}
				
				$(obj).removeClass("searching");
				$(obj).find("div.busy").hide();
				
				if (ie == 6)
				{
					obj.find("div.summary").show();
					
					if (tableOptions.paging)
					{
						obj.find("select.perPage").show();						
					}
				}
			});
	};

	$.fn.gotoFirstPage = function()
	{
		if ($(this).length > 0)
		{
			var obj = $(this);
			var options = $.data(obj[0], "tableOptions");
			
			if (options.page > 1)
			{
				options.page = 1;
				performSearch($(this), options);			
			}		
		}		
	};

	$.fn.gotoPreviousPage = function()
	{
		if ($(this).length > 0)
		{
			var obj = $(this);
			var options = $.data(obj[0], "tableOptions");
			
			if (options.page > 1)
			{
				options.page--;		
				performSearch(obj, options);
			}
		}
	};

	$.fn.gotoNextPage = function()
	{
		if ($(this).length > 0)
		{
			var obj = $(this);
			var options = $.data(obj[0], "tableOptions");
			
			if (options.page < options.pages)
			{		
				options.page++;
				performSearch(obj, options);
			}
		}
	};

	$.fn.gotoLastPage = function()
	{
		if ($(this).length > 0)
		{
			var obj = $(this);
			var options = $.data(obj[0], "tableOptions");
			
			if (options.page < options.pages)
			{		
				options.page = options.pages;
				performSearch(obj, options);
			}
		}
	};
	
	$.fn.changePageSize = function(pageSize)
	{
		if ($(this).length > 0)
		{
			var obj = $(this);
			var options = $.data(obj[0], "tableOptions");
			var cookieName = $(this).attr("id") + ".perPage";
			var currentSize = parseInt($.cookie(cookieName));
			var newPage;
			var newSize = parseInt(pageSize);
			var topRecord;
			
			if (isNaN(newSize))
			{
				newSize = 10;
			}
			
			if (options.page == 1 || isNaN(currentSize))
			{
				newPage = 1;
			}
			else
			{
				topRecord = (currentSize * (options.page - 1)) + 1;
				newPage = Math.ceil(topRecord / newSize);
							
				if (newPage < 1 || isNaN(newPage))
				{
					newPage = 1;
				}
			}
			
			options.page = newPage;
			$.cookie(cookieName, newSize, { expires: 365, path: '/helpdeskonline' });
			
			performSearch(obj, options);
		}
	};
	
	$.fn.displayResults = function(options)
	{
		if ($(this).length > 0)
		{
			var params = $.extend(
					{
						layout: 1,
						hide: false,
						url: "",
						page: 1,
						pages: 0,
						paging: true,
						recordName: "records",
						rowClass: "",
						columnBefore: false,
						columnBeforeHtml: "",
						columnAfter: false,
						columnAfterHtml: "",
						errorMsg: "",
						onBefore: "",
						onAfter: "",
						onError: "",
						onDisplay: ""
					}, options);

			params.layout = 1;
			$.data($(this)[0], "tableOptions", params);
			
			performSearch($(this), params);
		}
	};
	
	$.fn.listResults = function(options)
	{
		if ($(this).length > 0)
		{
			var params = $.extend(
					{
						layout: 2,
						hide: false,
						url: "",
						page: 1,
						pages: 0,
						paging: true,
						recordName: "records",
						itemIsLink: false,
						errorMsg: "",
						onBefore: "",
						onAfter: "",
						onError: "",
						onDisplay: ""
					}, options);
					
			params.layout = 2;
			$.data($(this)[0], "tableOptions", params);
					
			performSearch($(this), params);			
		}
	};
}(jQuery));
