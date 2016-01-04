
function StatsBlock() {
	this.Att = 0;
	this.Cmp = 0;
	this.Sack = 0;
	this.Int = 0;
	this.PsYds = 0;
	this.PsTD = 0;
	this.Rush = 0;
	this.RshYds = 0;
	this.RshTD = 0;
};

function CareerStatsBlock(stats, type) {
	this.years = [];
	this.rows = [];
	for(var i = 0; i < stats.length; i++) {
		this.years.push(stats[i].year);
	}

	this.years = _.uniq(this.years);

	_.each(this.years, function(el, index, list) {
		var statsByYear = _.filter(stats, {year: el}),
			attempts = 0,
			completions = 0,
			yards = 0,
			y = 0,
			that = this;
		_.each(statsByYear, function(el, index, list) {
			attempts += parseInt(el.stats.Att);
			completions += parseInt(el.stats.Cmp);
			yards += parseInt(el.stats.PsYds);
		}, that);
		this.rows.push({
			attempts: attempts,
			completions: completions,
			yards: yards,
			y: (type === "ypa") ? Number(parseFloat(yards/attempts).toFixed(1)) : Number(parseFloat((completions/attempts)*100).toFixed(1))
		});
	}, this);

}

function ChartStat(row) {
	this.datetime = Date.parse(row[5]),
	this.y = null,
	this.year = row[3],
	this.week = row[4],
	this.game = {
		team: row[6],
		teamImg: row[7],
		opp: row[8],
		oppImg: row[9]
	},
	this.stats = {
		Att: row[10],
		Cmp: row[11],
		Sack: row[12],
		Int: row[13],
		PsYds: row[14],
		PsTD: row[15],
		Rush: row[16],
		RshYds: row[17],
		RshTD: row[18]
	},
	this.name = "Week " + row[4] + ", " + row[3];
}

function Team(team) {
	switch(team) {
		case 'CIN':
			this.primary = "#FB4F14";
			this.secondary = "#FFFFFF";
			break;
		case 'DAL':
			this.primary = "#0D254C";
			this.secondary = "#C5CED6";
			break;
		case 'NE':
			this.primary = "#0D254C";
			this.secondary = "#D6D6D6";
			break;
		default:
			this.primary = "#7CB5EC";
			this.secondary = "#EFEFEF";
	}
} 

new Vue({
	el: 'body',
	data: {
		players: [
			{id: 1870523, text: 'Tom Brady'},
			{id: 1949528, text: 'Tony Romo'},
			{id: 2223207, text: 'Andy Dalton'}
		],
		playerStats: {},
		playerName: '',
		playerID: '',
		playerImg: '',
		playerTeam: '',
		playerTeamImg: '',
		seasonYears: [],
		totalStats: {},
		seasonStats: {}
	},

	methods: {
		toggleMenu: function(e) {
			e.preventDefault();
			$("#wrapper").toggleClass("toggled");
		},

		getPlayerData: function(player) {
			var vm = this;
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: 'assets/json/nfl-'+player+'.json',
				success: function(data) {
					vm.playerStats = data;
					vm.processPlayerData();
				}
			});
		},

		processPlayerData: function() {
			this.playerName = this.playerStats.rows[0][1];
			this.playerID = this.playerStats.rows[0][0];
			this.playerImg = this.playerStats.rows[0][2];
			this.playerTeam = this.playerStats.rows[0][6];
			this.playerTeamImg = this.playerStats.rows[0][7];
			var years = [];
			for(var i = 0; i < this.playerStats.rows.length; i++) {
				var row = this.playerStats.rows[i];
				years.push(row[3]);
			}
			this.seasonYears = _.uniq(years);
			this.getTotalStats();
		},

		getSeasonStats: function(season) {

			var seasonStats = new StatsBlock(),
				ypaChartData = [],
				cmpChartData = [],
				team = "";

			for(var i = 0; i < this.playerStats.rows.length; i++) {
				var row = this.playerStats.rows[i];
				if(row[3] === season) {
					seasonStats.Att += row[10];
					seasonStats.Cmp += row[11];
					seasonStats.Sack += row[12];
					seasonStats.Int += row[13];
					seasonStats.PsYds += row[14];
					seasonStats.PsTD += row[15];
					seasonStats.Rush += row[16];
					seasonStats.RshYds += row[17];
					seasonStats.RshTD += row[18];
					
					var ypaData = new ChartStat(row);

					if(parseFloat((row[14]/row[10]).toFixed(1)) >= 0 ) {
						ypaData.y = parseFloat((row[14]/row[10]).toFixed(1));
					}

					ypaChartData.push(ypaData); 

					var cmpData = new ChartStat(row);

					if(parseFloat(((row[11]/row[10])*100).toFixed(1)) >= 0) {
						cmpData.y = parseFloat(((row[11]/row[10])*100).toFixed(1));
					}
					cmpChartData.push(cmpData); 

					team = row[6];
				}
			}
			this.seasonStats = seasonStats;

			this.buildSeasonCharts(ypaChartData, cmpChartData, team);
		},

		getTotalStats: function() {
			var totalStats = new StatsBlock(),
				ypaChartData = [],
				cmpChartData = [],
				team = "";

			for(var i = 0; i < this.playerStats.rows.length; i++) {
				var row = this.playerStats.rows[i];
				totalStats.Att += row[10];
				totalStats.Cmp += row[11];
				totalStats.Sack += row[12];
				totalStats.Int += row[13];
				totalStats.PsYds += row[14];
				totalStats.PsTD += row[15];
				totalStats.Rush += row[16];
				totalStats.RshYds += row[17];
				totalStats.RshTD += row[18];

				var ypaData = new ChartStat(row);

				if(parseFloat((row[14]/row[10]).toFixed(1)) >= 0 ) {
					ypaData.y = parseFloat((row[14]/row[10]).toFixed(1));
				}

				ypaChartData.push(ypaData); 

				var cmpData = new ChartStat(row);

				if(parseFloat(((row[11]/row[10])*100).toFixed(1)) >= 0) {
					cmpData.y = parseFloat(((row[11]/row[10])*100).toFixed(1));
				}
				cmpChartData.push(cmpData); 
				team = row[6];
			}

			this.totalStats = totalStats;
			// Build Charts
			this.buildTotalCharts(ypaChartData, cmpChartData, team);

		},

		buildTotalCharts: function(ypa, cmp, team) {
			var careerStatsYPA = new CareerStatsBlock(ypa, "ypa"),
				careerStatsCMP = new CareerStatsBlock(cmp, "cmp"),
				seasonTeam = new Team(team);

			console.log(careerStatsYPA.rows[0]);
			$('#yards-per-attempt').highcharts({
				chart: {
		            type: 'spline',
		            plotBackgroundColor: {
		            	linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
					    stops: [
					        [0, seasonTeam.secondary],
					        [1, seasonTeam.primary],
					    ]
		            },
		            plotBorderColor: seasonTeam.secondary,
		            plotBorderWidth: 2,
		            borderColor: seasonTeam.primary,
		            borderWidth: 2,
		            className: team,
		            renderTo: 'yards-per-attempt'
		        },
		        credits: {
		        	href: "https://github.com/travtex",
		        	text: "Hire This Guy"
		        },
		        title: {
		            text: 'Yards per Attempt'
		        },
		        xAxis: {
		       		categories: careerStatsYPA.years
		        },
		        yAxis: {
		            title: {
		                text: 'Yards per Attempt'
		            }
		        },

				legend: {
					enabled: false
				},

		        series: [{
		            name: 'YPA',
		            data: careerStatsYPA.rows,
		            color: seasonTeam.secondary,
		        }],

		        tooltip: {
		        	useHTML: true,
		        	borderColor: seasonTeam.primary,
		        	borderRadius: 5,
		        	formatter: function() {
		        		return "Stuff Here"
		        	}
		        }
			});

			$('#completion-percentage').highcharts({
				chart: {
		            type: 'spline',
		            plotBackgroundColor: {
		            	linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
					    stops: [
					        [0, seasonTeam.secondary],
					        [1, seasonTeam.primary],
					    ]
		            },
		            plotBorderColor: seasonTeam.secondary,
		            plotBorderWidth: 2,
		            borderColor: seasonTeam.primary,
		            borderWidth: 2,
		            className: team,
		            renderTo: 'completion-percentage',
		        },
		        credits: {
		        	href: "https://github.com/travtex",
		        	text: "Hire This Guy"
		        },
		        title: {
		            text: 'Completion Percentage'
		        },
		        xAxis: {
		       		categories: careerStatsCMP.years
		        },
		        yAxis: {
		            title: {
		                text: 'Completion Percentage'
		            }
		        },
		        
				legend: {
					enabled: false
				},

		        series: [{
		            name: 'CMP%',
		            data: careerStatsCMP.rows,
		            color: seasonTeam.secondary,
		        }],

		        tooltip: {
		        	useHTML: true,
		        	borderColor: seasonTeam.primary,
		        	borderRadius: 5,
		        	formatter: function() {
		        		return "Stuff Here"
		        	}
		        }
			});
		},

		buildSeasonCharts: function(ypa, cmp, team) {
			// Build Charts
			var xCatArray = [],
				seasonTeam = new Team(team);

			for (var i = 0; i < ypa.length; i++) {
				xCatArray.push("Week " + ypa[i].week);
			}
			console.log(ypa);
			$('#yards-per-attempt').highcharts({
		        chart: {
		            type: 'spline',
		            plotBackgroundColor: {
		            	linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
					    stops: [
					        [0, seasonTeam.secondary],
					        [1, seasonTeam.primary],
					    ]
		            },
		            plotBorderColor: seasonTeam.secondary,
		            plotBorderWidth: 2,
		            borderColor: seasonTeam.primary,
		            borderWidth: 2,
		            className: team,
		            renderTo: 'yards-per-attempt'
		        },
		        credits: {
		        	href: "https://github.com/travtex",
		        	text: "Hire This Guy"
		        },
		        title: {
		            text: 'Yards per Attempt'
		        },
		        xAxis: {
		       		categories: xCatArray
		        },
		        yAxis: {
		            title: {
		                text: 'Yards per Attempt'
		            }
		        },
		        
				legend: {
					enabled: false
				},

		        series: [{
		            name: 'YPA',
		            data: ypa,
		            color: seasonTeam.secondary,
		        }],

		        tooltip: {
		        	useHTML: true,
		        	borderColor: seasonTeam.primary,
		        	borderRadius: 5,
		        	formatter: function() {
		        		return "<h5>"+this.point.name+": </h5><div style='text-align:center;'><img src='"+this.point.game.teamImg+"' style='width:25px;'> vs " + 
		        				"<img src='"+this.point.game.oppImg+"' style='width:25px;'></div>" +
		        				"<table class='table table-hover table-condensed'>" +
		        				"<tr><td>Attempts</td><td>" + this.point.stats.Att + "</td></tr>" +
		        				"<tr><td>Yards</td><td>" + this.point.stats.PsYds + "</td></tr>" +
		        				"<tr><td><strong style='color: "+seasonTeam.primary+";'>YPA</strong></td><td><strong>" + this.y + "</strong></td></tr>" +
		        				"</table>"
		        	}
		        }
		    });
		
		    $('#completion-percentage').highcharts({

		        chart: {
		            type: 'spline',
		            plotBackgroundColor: {
		            	linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
					    stops: [
					        [0, seasonTeam.secondary],
					        [1, seasonTeam.primary],
					    ]
		            },
		            plotBorderColor: seasonTeam.secondary,
		            plotBorderWidth: 2,
		            borderColor: seasonTeam.primary,
		            borderWidth: 2,
		            className: team,
		            renderTo: 'completion-percentage',
		        },
		        credits: {
		        	href: "https://github.com/travtex",
		        	text: "Hire This Guy"
		        },
		        title: {
		            text: 'Completion Percentage'
		        },
		        xAxis: {
		       		categories: xCatArray
		        },
		        yAxis: {
		            title: {
		                text: 'Completion Percentage'
		            }
		        },
		        
				legend: {
					enabled: false
				},

		        series: [{
		            name: 'CMP%',
		            data: cmp,
		            color: seasonTeam.secondary,
		        }],

		        tooltip: {
		        	useHTML: true,
		        	borderColor: seasonTeam.primary,
		        	borderRadius: 5,
		        	formatter: function() {
		        		return "<h5>"+this.point.name+": </h5><div style='text-align:center;'><img src='"+this.point.game.teamImg+"' style='width:25px;'> vs " + 
		        				"<img src='"+this.point.game.oppImg+"' style='width:25px;'></div>" +
		        				"<table class='table table-hover table-condensed'>" +
		        				"<tr><td>Completions</td><td>" + this.point.stats.Cmp + "</td></tr>" +
		        				"<tr><td>Attmpts</td><td>" + this.point.stats.Att + "</td></tr>" +
		        				"<tr><td><strong style='color: "+seasonTeam.primary+";'>Cmp %</strong></td><td><strong>" + this.y + "</strong></td></tr>" +
		        				"</table>"
		        	}
		        }
		    });
		}
	},

	components: {
		
	},

	ready: function() {

	},
});

