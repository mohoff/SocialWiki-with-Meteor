Template.lineupRankings.helpers({
	lineups: function() {
		var lineups, lineupsArray = [];
    var searchQuery = Session.get("searchQueryLineups");

		if(searchQuery){
			console.log("searchQueryLineups: " + searchQuery);
			var searchQueryRegExp = new RegExp(searchQuery, 'i');
   		lineups = Lineups.find({
				$or: [
					{'lineup.name': searchQueryRegExp},
		  		{'lineup.levelColor': searchQueryRegExp},
		      {'lineup.synergies.$.name': searchQueryRegExp},
					{'lineup.synergies.$.status': searchQueryRegExp}
				]
			});

			lineups.forEach(function(lineup){
      	lineupsArray.push(lineup);
      });

			var cat = UI._globalHelpers['getNormalizedRankingCategory']();	// [arena,crusade,pvefarming]
			return sortHeroesArray(lineupsArray, cat);
		} else {
			return this;		// might be better because "this" is already sorted lineups-array
		}
	}
});
