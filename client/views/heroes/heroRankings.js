Template.heroRankings.helpers({
  rankingCategory: function(){
    return UI._globalHelpers['getRankingCategory']();
  },
	heroes: function() {
		var heroes, heroesArray = [];
    var searchQuery = Session.get("searchQuery");

		if(searchQuery){
			console.log("searchQuery: " + searchQuery);
			var searchQueryRegExp = new RegExp(searchQuery, 'i');
   		heroes = Heroes.find({
				$or: [
					{'hero.name': searchQueryRegExp},
		  		{'hero.surname': searchQueryRegExp},
		      {'hero.type': searchQueryRegExp},
		      {'hero.badges': searchQueryRegExp},
		      {'hero.attributes': searchQueryRegExp}
				]
			});

			heroes.forEach(function(hero){
      	heroesArray.push(hero);
      });

			//console.log("rankingCategory: " + rankingCategory());
			var cat = UI._globalHelpers['getNormalizedRankingCategory']();	// [arena,crusade,pvefarming]
			return sortHeroesArray(heroesArray, cat);
		} else {
			return this;		// might be better because "this" is already sorted heroes-array
		}
	}
});

Template.heroRankings.rendered = function(){
	var query = Session.get('searchQuery');
	if(query){
		$('#search').val(query);
	}
	$('#search').change(function(){
		var val = $(this).val();
		Session.set('searchQuery', val);
	});
	$('#search').bind("enterKey", function(e) {
		$(this).blur();
	});
	$('#search').keyup(function(e){
		if(e.keyCode == 13){
			$(this).trigger("enterKey");
		}
	});
};
