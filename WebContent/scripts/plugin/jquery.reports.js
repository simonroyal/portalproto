$(document).ready(function ()
{		
});

(function ($)
{
	function createPpmCalendar(obj)
	{
		var html = "<table class='ppmCalendar'><thead></thead><tbody></tbody></table>";	
		var url = root + "siteuser/ppmlookup.jsf?";
		
		$(obj).find("div.details").show();
		$(obj).find("table.legend").show();
		$(obj).append(html);
		
		$.getJSON(url, function(json)
		{
		})
			.success(function(json)
			{
				if (json && json.login)
				{
					switchToUrl(loginUrl);
				}
				
				if (json && json.months)
				{
					var header = $(obj).find("table.ppmCalendar thead");
					var keys = [];
					
					html = "<tr><th>PM No.</th><th>Task / Description</th>";
					
					if (json.months.length > 0)
					{
						for (var i = 0; i < json.months.length; i++)
						{
							keys.push(json.months[i]);
						}				
								
						html += "<th colspan='2' class='month'>" + keys.join("</th><th colspan='2' class='month'>") + "</th></tr>";
						
						$(header).append(html);
					}
				}
				
				if (json && json.pms)
				{
					var body = $(obj).find("table.ppmCalendar tbody");
					var row;
					var monthClass;
					var orderCount = 0;
					var statuses = ["Planned", "Completed On Time", "Late - Target", "Late - Actual", "Outstanding"];
					
					for (var i = 0; i < json.pms.length; i++)
					{
						html = "<tr><td>" + json.pms[i].pmnum + "</td>" +
					           "<td>" + json.pms[i].description.substring(0, 45) + "</td></tr>";
							
						$(body).append(html);
						row = $(body).find("tr:last-child");
							
						for (var j = 0; j < json.pms[i].months.length; j++)
						{
							orderCount = json.pms[i].months[j].orders.length;
								
							if (orderCount > 2)
							{
								$(row).append("<td colspan='2' class='sm'></td>");									
							}
							else if (orderCount == 0)
							{
								$(row).append("<td colspan='2'></td>");									
							}
							else
							{
								for (var k = 0; k < orderCount; k++)
								{
									monthClass = "month hasData s" + json.pms[i].months[j].orders[k].status;
									
									$(row).append("<td>" + json.pms[i].months[j].orders[k].jobType + "</td>");
									$(row).find("td:last-child").addClass(monthClass);
										
									$(row).find("td:last-child").data("woDetails",
										{
											jobType: json.pms[i].months[j].orders[k].jobType,
											wonum: json.pms[i].months[j].orders[k].wonum,
											status: statuses[json.pms[i].months[j].orders[k].status],
											target: json.pms[i].months[j].orders[k].target,
											actual: json.pms[i].months[j].orders[k].actual
										});
								}
									
								if (orderCount == 1)
								{
									$(row).find("td:last-child").attr("colspan", "2");
								}
							}							
						}							
					}
												
					$(obj).find("table.ppmCalendar td.hasData").qtip(
					{
						content: 
						{
							title: "Work Order Details",
							text: function()
							{
								var details = $(this).data("woDetails");
									
								if (details)
								{
									$("#wonum").text(details.wonum);
									$("#targetComp").text(details.target);
									$("#actualComp").text(details.actual);
									$("#status").text(details.status);										
								}
									
								return $("#woInfo").html();
							}
						},
						show:
						{
							solo: true
						},
						position:
						{
							viewport: $("table.ppmCalendar"),
							my : "top right",
							at: "bottom left"
						}							
					});
					
					if (json.pms.length == 0)
					{
						$(obj).find("p.noPpm").show();
						$(obj).find("table.legend").hide();
						$(obj).find("table.ppmCalendar").hide();						
					}
					else
					{
						$(obj).find("p.noPpm").hide();
						$(obj).find("table.legend").show();
						$(obj).find("table.ppmCalendar").show();						
					}
				}
			})
			.error(function()
			{
				showMessage("There was a problem finding the PPM data.", $(obj).find("div.messages"));					
				$(obj).find("p.noPpm").hide();
				$(obj).find("table.legend").hide();
				$(obj).find("table.ppmCalendar").hide();
			})
			.complete(function()
			{
				$(obj).find("div.busy").hide();
			});		
	};
	
	function displayChart(plotArea, chartType)
	{
		var data = $.data(plotArea[0], "chartData");
		
		if (chartType && chartType == "bar")
		{
			$.plot(plotArea, data[0],
				{
					series: { stack: true, bars: { show: true } },
			    	bars: { show: true, barWidth: 21*24*60*60*1000, align: "center"  },
			    	xaxis: { mode: "time", minTickSize: [1, "month"] },
			    	yaxis: { min: 0, tickDecimals: 0 },
				    legend: { show: true, backgroundColor: null, position: "ne" },
				    grid: { backgroundColor: { colors: ["#fff", "#f3eff0"] } },
				    stack: true
				});
		}
		else if (chartType && chartType == "pie")
		{						
			$.plot(plotArea, data[1],
				{
			    	series:
			    	{
			    		pie:
			    		{
			    			show: true,
			    			radius: 1,
			    			label:
			    			{
			    				show: true,
			    				radius: 3/4,
			    				formatter: function(label, series)
			    				{
			                        return '<div style="font-size:10pt;text-align:center;padding:2px;color:#333;">'+label+'<br/>'+Math.round(series.percent)+'%</div>';
			                    },
			                    background: { opacity: 0.4 }
			    			},
			    			threshold: 0.05
			    		}
			    	},        
			    	legend: { show: true }
				});						
		}
		else
		{
			$.plot(plotArea, data[0],
				{
				    lines : { show: true },
				    points: { show: true },
				    xaxis: { mode: "time", minTickSize: [1, "month"] },
				    yaxis: { min: 0, tickDecimals: 0 },
				    legend: { show: true, backgroundColor: null, position: "ne" },
				    grid: { backgroundColor: { colors: ["#fff", "#f3eff0"] } }
				});						
		}
	}

	function createComplianceChart(obj)
	{
		var url = root + "siteuser/compliancelookup.jsf?";

		$.getJSON(url, function(json) 
		{
		})
			.success(function(json)
			{
				if (json && json.login)
				{
					switchToUrl(loginUrl);
				}

				var plotArea = $(obj).find("div.chart");
				var compliantData;
				var lowRiskData;
				var nonCompliantData;
				var unknownData;
				var chartType = $(obj).find("select.chartType").val();
				var lineData = [];
				var pieData = [];
				
				if (json && json.compliant)
				{
					if (json.compliantTotal > 0 || json.lowRiskTotal > 0 ||
						json.nonCompliantTotal > 0 || json.unknownTotal > 0)
					{
						$(obj).find("p.summary").text("This location is " + json.compliantPercentage + "% compliant.");
						$(obj).find("p.summary").show();
						$(obj).find("div.chart").show();
						$(obj).find("div.options").show();
						
						compliantData = json.compliant;
						lowRiskData = json.lowRisk;
						nonCompliantData = json.nonCompliant;
						unknownData = json.unknown;
						
						for (var i = 0; i < json.months.length; i++)
						{
						    compliantData[i][0] = new Date(json.months[i]).getTime();
						    lowRiskData[i][0] = new Date(json.months[i]).getTime();
						    nonCompliantData[i][0] = new Date(json.months[i]).getTime();
						    unknownData[i][0] = new Date(json.months[i]).getTime();
						}
						
						lineData.push({ label: "Compliant", data: compliantData, color: "#16c031" });
						lineData.push({ label: "Low Risk", data: lowRiskData, color: "#ffe205" });
						lineData.push({ label: "Non-Compliant", data: nonCompliantData, color: "#f00" });
						
						pieData.push({ label: "Compliant", data: json.compliantTotal, color: "#16c031" });
						pieData.push({ label: "Low Risk", data: json.lowRiskTotal, color: "#ffe205" });
						pieData.push({ label: "Non-Compliant", data: json.nonCompliantTotal, color: "#f00" });
						
						if (json.unknownTotal > 0)
						{
							lineData.push({ label: "Unknown", data: unknownData, color: "#ff9900" });
							pieData.push({ label: "Unknown", data: json.unknownTotal, color: "#ff9900" });
						}
						
						$.data(plotArea[0], "chartData", [ lineData, pieData ]);
						displayChart(plotArea, chartType);
																
						if (json.orders)
						{
							if (json.orders.length == 0)
							{
								$(obj).find("table.results").hide();
								$(obj).find("p.noHistoric").show();
							}
							else
							{
								var body = $(obj).find("table.results tbody");
								var html;
								
								for (var i = 0; i < json.orders.length; i++)
								{
									html = "<tr>" +
										   "<td>" + json.orders[i].wonum + "</td>" +
										   "<td>" + json.orders[i].asset + "</td>" +
										   "<td>" + json.orders[i].service + "</td>" +
										   "<td>" + json.orders[i].jobPlan + "</td>" +
										   "<td>" + json.orders[i].description + "</td>" +
										   "<td>" + json.orders[i].targetStart + "</td>" +
										   "<td>" + json.orders[i].hasFollowUp + "</td>" +
										   "<td>" + json.orders[i].originatingWonum + "</td>" +
										   "<td>" + json.orders[i].status + "</td>" +
										   "</tr>";
									
									$(body).append(html);
								}
								
								$(obj).find("table.results tbody tr:odd").addClass("even");
								$(obj).find("p.noHistoric").hide();
								$(obj).find("table.results").show();
							}						
						}						
					}
					else
					{
						$(obj).find("p.summary").text("There are no compliance records.");
						$(obj).find("p.summary").show();
						$(obj).find("div.chart").hide();
						$(obj).find("div.options").hide();
						$(obj).find("p.noHistoric").show();
						$(obj).find("table.results").hide();						
					}					
				}
				else
				{
					showMessage("There was a problem finding the compliance data.", $(obj).find("div.messages"));					
					$(obj).find("p.summary").hide();
					$(obj).find("div.chart").hide();
					$(obj).find("div.options").hide();
					$(obj).find("p.noHistoric").hide();
					$(obj).find("table.results").hide();
				}
			})
			.error(function()
			{
				showMessage("There was a problem finding the compliance data.", $(obj).find("div.messages"));
				$(obj).find("p.summary").hide();
				$(obj).find("div.chart").hide();
				$(obj).find("div.options").hide();
				$(obj).find("p.noHistoric").hide();
				$(obj).find("table.results").hide();
			})
			.complete(function()
			{
				$(obj).find("div.busy").hide();
			});					
	};
	
	$.fn.ppmCalendar = function()
	{
		if ($(this).length > 0)
		{
			closeMessages($(this).find("div.messages"));
			$("#currentLocation a.filterToggle.up").trigger("click");
			$(this).show();
			$(this).find("div.busy").show();
			$(this).find("table.ppmCalendar").remove();
			createPpmCalendar($(this));			
		}
	};
	
	$.fn.switchComplianceChartType = function(chartType)
	{
		if ($(this).length > 0)
		{
			displayChart($(this).find("div.chart"), chartType);			
		}
	};
	
	$.fn.complianceChart = function()
	{
		if ($(this).length > 0)
		{
			closeMessages($(this).find("div.messages"));
			$(this).show();
			$(this).find("div.busy").show();
			$(this).find("table.results tbody tr").remove();
			createComplianceChart($(this));
		}
	};
}(jQuery));
