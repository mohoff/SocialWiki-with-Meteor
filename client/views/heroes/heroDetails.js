Template.heroDetails.helpers({
	filteredAndSortedSynergies: function(synergies){
		var filteredAndSorted = [];
		var synergyDisplayLimit = 10;

		for(var i=0; i<synergies.length; i++){
			// at least 5 deleteVotes and deleteVotes need to be higher than normal votes to ignore the synergy
			if(!((synergies[i].deleteVotes >= 5) &&
				(synergies[i].deleteVotes > synergies[i].votes) &&
				(filteredAndSorted.length <= synergyDisplayLimit))){
					filteredAndSorted.push(synergies[i]);
			}
		}
		filteredAndSorted.sort(function(a,b){
			return b.votes - a.votes; // sort descending
		});
		Session.set('highestVotesAmongSynergies', filteredAndSorted[0].votes);
		return filteredAndSorted;
	},

	synergyLabelColor: function(synergy){
		console.log("synergyLabelColor INPUT: " + JSON.stringify(synergy));
		var highestVoted = parseInt(Session.get('highestVotesAmongSynergies'));
		console.log("highestVoted: " + highestVoted);
		var saturationFactor;
		if(highestVoted > 0){
			saturationFactor = synergy.votes / highestVoted - 0.2;
		} else {
			saturationFactor = 0.5;
		}
		var rMax = 51;//92;
		var gMax = 144;//184;
		var bMax = 0;//92;

		var alpha = Math.max(Math.ceil(saturationFactor*10)/10, 0.3);

		//var r = Math.max(Math.ceil(rMax*saturationFactor), Math.ceil(rMax*0.2));
		//var g = Math.max(Math.ceil(gMax*saturationFactor), Math.ceil(gMax*0.2));
		//var b = Math.max(Math.ceil(bMax*saturationFactor), Math.ceil(bMax*0.2));

		//console.log('rgb(' + r + ', ' + g + ', ' + b + ')');
		//return 'rgb(' + r + ', ' + g + ', 0)';
		return 'rgba(' + rMax + ', ' + gMax + ', 0 ,' + alpha + ')';
	},

	synergyVotedSrc: function(name){
		//console.log("in synergyVotedSrc - this: " + JSON.stringify(this));
		var userIdentifier = Meteor.userId();
		var heroObj = this.parent;

		var synergyArray = [];
		if(heroObj.hero && heroObj.hero.synergy){
			//console.log("es gibt this.hero.synergy");
			synergyArray = heroObj.hero.synergy;
		}
		//console.log("nach IF. name: " + name);
		//console.log("synergyArray: " + JSON.stringify(synergyArray));
		var storedVoters, votes;
		for(var i=0; i<synergyArray.length; i++){
			//console.log("synergy.name: " + JSON.stringify(synergyArray[i]));
			if(synergyArray[i].name === name){
				storedVoters = synergyArray[i].voters;
				votes = synergyArray[i].votes;
				break;
			}
		}

		console.log("SynergyVoters: " + JSON.stringify(storedVoters));
		console.log("SynergyVotes: " + votes);

		var hasAlreadyVoted = _.contains(storedVoters, userIdentifier);
		if(hasAlreadyVoted){
			return '/voted-up.png';
		} else {
			return '/voteable-up.png';
		}
	},
	synergyDeleteVotedSrc: function(name){
		//console.log("in synergyVotedSrc - this: " + JSON.stringify(this));
		var userIdentifier = Meteor.userId();
		var heroObj = this.parent;

		var synergyArray = [];
		if(heroObj.hero && heroObj.hero.synergy){
			//console.log("es gibt this.hero.synergy");
			synergyArray = heroObj.hero.synergy;
		}
		//console.log("nach IF. name: " + name);
		//console.log("synergyArray: " + JSON.stringify(synergyArray));
		var storedDeleteVoters, deleteVotes;
		for(var i=0; i<synergyArray.length; i++){
			//console.log("synergy.name: " + JSON.stringify(synergyArray[i]));
			if(synergyArray[i].name === name){
				storedDeleteVoters = synergyArray[i].deleteVoters;
				deleteVotes = synergyArray[i].deleteVotes;
				break;
			}
		}

		console.log("SynergyDeleteVoters: " + JSON.stringify(storedDeleteVoters));
		console.log("SynergyDeleteVotes: " + deleteVotes);

		var hasAlreadyVoted = _.contains(storedDeleteVoters, userIdentifier);
		if(hasAlreadyVoted){
			return '/img_synergies/delete-synergy-voted.png';
		} else {
			return '/img_synergies/delete-synergy-votable.png';
		}
	},

	skills: function(skillsArray){
		// returns skillArray, sorted by skill order/color.
		var skills = [];
		for(var i=0; i<skillsArray.length; i++){
			skills.push(skillsArray[i]);
		}
		skills.sort(function(a,b){
			return a.order - b.order; // sorts ascending (?)
		});
		return skills;
	},

	skillImageSrc: function(order, heroname){
		// order = 1,2,3,4
		// heroname
		// generate srcPath as /img_heroes/<heroname>/<order>
		console.log("order: " + order);
		console.log("heroname: " + JSON.stringify(heroname));
		var normalizedName = UI._globalHelpers['normalizeString'](heroname);
		return '/img_heroes/' + normalizedName + '/' + order + '.jpg';		// change to .png when footage exists
	},

	skillBgColor: function(order){
		var index = parseInt(order) - 1;
		var alphaFactor = 0.3;
		//var colorArray = ['133,131,132', '61,164,65', '35,155,223', '195,35,223', '224,129,25'];
		return 'rgba(' + colorArray[indexToColor[index]] + ',' + alphaFactor + ');';
	},

	srcPathSkillType: function(type){
		var lowercaseType = type.toLowerCase();
		return '/img_skilltypes/' + lowercaseType + '.png';
	},

  forLevelValue: function(){
		return Session.get('forLevel') || 1;
	},
	forStarValue: function(){
		return Session.get('forStar') || 1;
	},

	stats: function(){
		var lvl = Session.get('forLevel') || 1;
		var star = Session.get('forStar') || 1;
		console.log("LEVEL: " + lvl);
		var stats = this.hero.stats;
		var result = {
			hp: Math.round((stats.base.hp || 0) + (stats.base.str + (stats.growth.str*(star+1))*lvl) * 18),
			ad: Math.round((stats.base.ad || 0) + (stats.base.str + (stats.growth.str*(star+1))*lvl) * 1.4 + (stats.base.agi + (stats.growth.agi*(star+1))*lvl) * 0.7),
			ap: Math.round((stats.base.ap || 0) + (stats.base.int + (stats.growth.int*(star+1))*lvl) * 2.4),
			armor: Math.round((stats.base.armor || 0) + (stats.base.str + (stats.growth.str*(star+1))*lvl) * 0.25 + (stats.base.agi + (stats.growth.agi*(star+1))*lvl) * 0.1),
			mres: Math.round((stats.base.mres || 0) + (stats.base.int + (stats.growth.int*(star+1))*lvl) * 0.1),
			crit: Math.round((stats.base.crit || 0) + (stats.base.agi + (stats.growth.agi*(star+1))*lvl) * 0.4)
		};
		return result;
	}

	/*statsHP: function(hero){
		return 18 * hero.hero.
	}*/
});

Template.heroDetails.events({
  'click .synergyVote': function(event){
    event.preventDefault();
		var hero = this.parent;
    var votedSynergyName = this.context.name; // since we're in the each-loop, 'this' references one synergyObj
    var currentUser = Meteor.user();
		console.log("votedSynergyName: " + votedSynergyName);
    Meteor.call('voteSynergy', currentUser, hero, votedSynergyName);
  },
	'click .synergyDeleteVote': function(event){
    event.preventDefault();
		var hero = this.parent;
    var votedSynergyName = this.context.name; // since we're in the each-loop, 'this' references one synergyObj
    var currentUser = Meteor.user();
		console.log("votedSynergyName: " + votedSynergyName);
    Meteor.call('voteDeleteSynergy', currentUser, hero, votedSynergyName);
  },

	'submit #addsynergyform': function(event){
		//event.preventDefault();
		var hero = this;
		var synergyName = event.target.name.value;
		var currentUser = Meteor.user();
		console.log("synergyName: " + synergyName);
		//console.log("hero: " + JSON.stringify(hero));
		Meteor.call('addSynergy', currentUser, hero, synergyName);
	}
});

Template.heroDetails.rendered = function () {

	$('#forLevelInput').change(function() {
		var val = $(this).val();
		if((val >= 1) && (val <= 90)){
			Session.set('forLevel', val);
		} else {
			if(val < 1){
				$(this).val(1);
				Session.set('forLevel', 1);
			} else if(val > 90){
				$(this).val(90);
				Session.set('forLevel', 90);
			}
		}
	});
	$('#forStarInput').change(function() {
		var val = $(this).val();
		if((val >= 1) && (val <= 5)){
			Session.set('forStar', val);
		} else {
			if(val < 1){
				$(this).val(1);
				Session.set('forStar', 1);
			} else if(val > 5){
				$(this).val(5);
				Session.set('forStar', 5);
			}
		}
	});
	$('#forLevelInput, #forStarInput').bind("enterKey", function(e) {
		$(this).blur();
	});
	$('#forLevelInput, #forStarInput').keyup(function(e){
		if(e.keyCode == 13){
			$(this).trigger("enterKey");
		}
	});



	var type = this.data.hero.type.toUpperCase();
	colorTriangle = function(x){
		if(x===0){
			return 'rgb(' + colorTypeArray[type] + ')';
		} else {
			return 'rgb(100,100,100)';
		}
	};

	var colorscale = d3.scale.category10();
	//Legend titles
	var LegendOptions = [this.data.hero.name,'Average ' + type + ' Hero'];
	//Data
	//console.log("this.data: " + JSON.stringify(this.data));
	getMaxNumber = function(arg1, arg2, arg3){
		return Math.max(Math.max(arg1, arg2), arg3);
	};

	//console.log("heroDetailsTHIS: " + JSON.stringify(this.hero));
	var dim = $('#growstats-chart').width() * 1.1;
	//console.log("DIM: " + dim);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

	var svg = d3.select('#growstats-chart')
		.selectAll('svg')
		.append('svg');

		//.attr("width", dim)
		//.attr("width", w+300)
		//.attr("height", dim)

	var RadarChart = {
	  draw: function(id, d, options){
		  var cfg = {
			  radius: 5,
			  w: dim, //600
			  h: dim, //600
			  factor: 1, // 1
			  factorLegend: .85, // .85
			  levels: 3,
			  maxValue: 0,
				baseColor: 'rgb(100,100,100)',
				avgColor: 'rgb(100,100,100)',
			  radians: 2 * Math.PI,
			  opacityArea: 0.5,
			  ToRight: 5,
			  TranslateX: 20,//80, // offset direction right
			  TranslateY: 30,//30, // offset direction bottom // 30 needed, so top axis text is visible
			  ExtraWidthX: 0, //100
			  ExtraWidthY: 0, //100
			  color: d3.scale.category10()
			};

		if('undefined' !== typeof options){
		  for(var i in options){
			if('undefined' !== typeof options[i]){
			  cfg[i] = options[i];
			}
		  }
		}
		cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){
			return d3.max(i.map(function(o){
				return o.value;
			}));
		}));
		var allAxis = (d[0].map(function(i, j){
			return i.axis;
		}));
		var total = allAxis.length; // total = amount of axis (?)
		var radius = cfg.factor * Math.min(cfg.w/2, cfg.h/2);
		var Format = d3.format('g'); // '%' .... 'g' = general = toPrecision()
		d3.select(id).select("svg").remove();

		var g = d3.select(id)
				.append("svg")
				.attr("viewBox", "0 0 " + dim + " " + dim )
			  .attr("preserveAspectRatio", "xMidYMid meet")
				.classed("svg-content-responsive", true)
				//.attr("width", cfg.w + cfg.ExtraWidthX)
				//.attr("height", cfg.h + cfg.ExtraWidthY)
				.append("g")
				.attr("transform", "scale(0.9) translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
				//.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");


		var tooltip;

		var legend = g.append("g")
			.attr("class", "legendColors")
			.attr("height", 100)
			.attr("width", 200)
			.attr('transform', 'translate(' + dim*0.65 + ', ' + dim*0 + ')')
			;
		//Create colour squares
		legend.selectAll('rect')
		  .data(LegendOptions)
		  .enter()
		  .append("rect")
		  //.attr("x", 135)
		  .attr("y", function(d, i){ return i * 30;})
		  .attr("width", 20)
		  .attr("height", 20)
		  .style("fill", function(d, i){ return colorTriangle(i);})//colorscale(i);})
		  ;
		//Create text next to squares
		legend.selectAll('text')
		  .data(LegendOptions)
		  .enter()
		  .append("text")
		  .attr("x", 30)
		  .attr("y", function(d, i){ return i * 30 + 15;})
		  .attr("font-size", "14px")
		  .attr("fill", "grey")
		  .text(function(d) { return d; });







		//Circular segments = 'spider net / radar shape' ... (with styling)
		for(var j=0; j<cfg.levels-1; j++){
		  var levelFactor = cfg.factor * radius * ((j+1)/cfg.levels); // 1 * radiusInPixels * radiusStepWidth
		  g.selectAll(".levels")
		   .data(allAxis)
		   .enter()
		   .append("svg:line")
		   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
		   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
		   .attr("class", "line")
		   .style("stroke", "grey")
		   .style("stroke-opacity", "0.75")
		   .style("stroke-width", "0.3px")
		   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
		}

		//Text indicating at what % each level is

		for(var j=0; j<cfg.levels; j++){
		  var levelFactor = cfg.factor * radius * ((j+1)/cfg.levels);
		  g.selectAll(".levels")
		   .data([1]) //dummy data
		   .enter()
		   .append("svg:text")
		   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
		   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
		   .attr("class", "legend")
		   .style("font-family", "sans-serif")
		   .style("font-size", "10px")
		   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
		   .attr("fill", "#737373")
		   .text(function(){
					if(j+1 < cfg.levels){
						return d3.round((j+1) * cfg.maxValue/cfg.levels);
					}
			 });
			//	Format((j+1) * cfg.maxValue/cfg.levels).toFixed());
		}




		var axis = g.selectAll(".axis")
				.data(allAxis)
				.enter()
				.append("g")
				.attr("class", "axis");

		/* axis linse */
		axis.append("line")
			.attr("x1", cfg.w/2) // origin as startpoint for axis lines
			.attr("y1", cfg.h/2) // origin as startpoint for axis lines
			.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
			.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
			.attr("class", "line")
			.style("stroke", "grey")
			.style("stroke-width", "1px");

		/* axis description */
		axis.append("text")
			.attr("class", "legend")
			.text(function(d){return d})
			.style("font-family", "sans-serif")
			.style("font-size", "11px")
			.style("fill", "grey")
			.attr("text-anchor", "middle")
			.attr("dy", "1.5em")
			.attr("transform", function(d, i){return "translate(0, -10)"})
			// TODO: bring axis text (STR,INT,AGI) closer to origin
			.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
			.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

		/* triangles */
		series = 0;
		d.forEach(function(y, x){
		  dataValues = [];
		  g.selectAll(".nodes")
			.data(y, function(j, i){
			  dataValues.push([
				cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
				cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
			  ]);
			});
		  dataValues.push(dataValues[0]);
		  g.selectAll(".area")
						 .data([dataValues])
						 .enter()
						 .append("polygon")
						 .attr("class", "radar-chart-serie"+series)
						 .style("stroke-width", "2px")
						 .style("stroke",function(){
							 return colorTriangle(x);
						 })
						 .attr("points",function(d) {
							 var str="";
							 for(var pti=0;pti<d.length;pti++){
								 str=str+d[pti][0]+","+d[pti][1]+" ";
							 }
							 return str;
						  })
						 .style("fill", function(j, i){
							 //return cfg.color(series)})
							 return colorTriangle(x);
						 })
						 .style("fill-opacity", cfg.opacityArea)
						 .on('mouseover', function (d){
											z = "polygon."+d3.select(this).attr("class");
											g.selectAll("polygon")
											 .transition(200)
											 .style("fill-opacity", 0.1);
											g.selectAll(z)
											 .transition(200)
											 .style("fill-opacity", .7);
										  })
						 .on('mouseout', function(){
											g.selectAll("polygon")
											 .transition(200)
											 .style("fill-opacity", cfg.opacityArea);
						 });
		  series++;
		});

		series=0;

		/* Dots in the triangle corners */
		d.forEach(function(y, x){
		  g.selectAll(".nodes")
			.data(y).enter()
			.append("svg:circle")
			.attr("class", "radar-chart-serie"+series)
			.attr('r', cfg.radius)
			.attr("alt", function(j){return Math.max(j.value, 0)})
			.attr("cx", function(j, i){
			  dataValues.push([
				cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
				cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
			]);
			return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
			})
			.attr("cy", function(j, i){
			  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
			})
			.attr("data-id", function(j){return j.axis})
			.style("fill", function(){
				return colorTriangle(x);
			})
			.style("fill-opacity", .9)
			.on('mouseover', function (d){
						newX =  parseFloat(d3.select(this).attr('cx')) - 10;
						newY =  parseFloat(d3.select(this).attr('cy')) - 5;

						// tooltips were duplicated, this being commented out works fine
						//tooltip
						//	.attr('x', newX)
						//	.attr('y', newY)
						//	.text(Format(d.value))
						//	.transition(200)
						//	.style('opacity', 1);

						z = "polygon."+d3.select(this).attr("class");
						g.selectAll("polygon")
							.transition(200)
							.style("fill-opacity", 0.1);
						g.selectAll(z)
							.transition(200)
							.style("fill-opacity", .7);
					  })
			.on('mouseout', function(){
						tooltip
							.transition(200)
							.style('opacity', 0);
						g.selectAll("polygon")
							.transition(200)
							.style("fill-opacity", cfg.opacityArea);
					  })
			.append("svg:title")
			.text(function(j){return Math.max(j.value, 0)});

		  series++;
		});



		//Tooltip
		tooltip = g.append('text')
				   .style('opacity', 0)
				   .style('font-family', 'sans-serif')
				   .style('font-size', '13px');
	  }
	};



	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////


	//var w = 500,	h = 500;

	if(this.data && this.data.hero && this.data.hero.stats &&
			this.data.hero.stats.growth &&
			this.data.hero.stats.growth.str &&
			this.data.hero.stats.growth.int &&
			this.data.hero.stats.growth.agi){

		var str = this.data.hero.stats.growth.str * 2; // multiplied by 2, so it represents value for Star=1
		var int = this.data.hero.stats.growth.int * 2; // multiplied by 2, so it represents value for Star=1
		var agi = this.data.hero.stats.growth.agi * 2; // multiplied by 2, so it represents value for Star=1

		var data = [
									[
						  			{axis: "STR", value: str},
						  			{axis: "INT", value: int},
						  			{axis: "AGI", value: agi}
								  ],[
						        {axis: "STR", value: 3},
						  			{axis: "INT", value: 3},
						  			{axis: "AGI", value: 3}
								  ]
							 ];

		//Options for the Radar chart, other than default
		var mycfg = {
		  w: dim,
		  h: dim,
		  maxValue: getMaxNumber(str, int, agi) + 1,
		  levels: getMaxNumber(str, int, agi) + 1,
		  ExtraWidthX: 0 //300
		};

		//Call function to draw the Radar chart
		//Will expect that data is in %'s
		RadarChart.draw("#chart", data, mycfg);
		$('#chart').show();
	} else {
		$('#chart').hide();
	}
};
