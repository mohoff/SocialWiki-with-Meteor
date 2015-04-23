Template.lineupHero.helpers({
	heroNameObj: function(){
		var heroName = this.heroname;
		console.log("heronamee: " + heroName);
		var heroNameNormed = UI._globalHelpers['normalizeString'](heroName);
		return {
			name: heroName,
			namenormalized: heroNameNormed
		};
	}
});
	/*heroesAsObjs = function() {
    var heroesAsObjs = [];
    for(var i=0; i=this.lineup.heroes.length; i++) {
        heroesAsObjs[i].index = i+1;
        heroesAsObjs[i].hero = this.lineup.heroes[i];
    }
    return heroesAsObjs;
	},*/
