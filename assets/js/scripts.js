
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
			$('a[href="#totals"').tab('show');
		},

		getSeasonStats: function(season) {

			var seasonStats = new StatsBlock();

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
				}
			}
			this.seasonStats = seasonStats;
		},

		getTotalStats: function() {
			var totalStats = new StatsBlock();
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
			}
			this.totalStats = totalStats;
		}
	},

	components: {
		
	},

	ready: function() {

	},
});