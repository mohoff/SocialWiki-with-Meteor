Template.heroDetails.helpers({
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
	}
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
	//console.log("heroDetailsTHIS: " + JSON.stringify(this.hero));
	var dim = $('#growstats-chart').width();
	//console.log("DIM: " + dim);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#growstats-chart')
	.selectAll('svg')
	.append('svg')

	//.attr("width", dim)
	//.attr("width", w+300)
	//.attr("height", dim)
/*
//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)')
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("What % of owners use a specific service in a week");

//Initiate Legend
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)')
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; });
*/
/////////////////////////////////


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
	   .text(Format((j+1)*cfg.maxValue/cfg.levels));
	}


	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2) // origin as startpoint for axis lines
		.attr("y1", cfg.h/2) // origin as startpoint for axis lines
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		// TODO: bring axis text (STR,INT,AGI) closer to origin
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


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
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
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
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;

					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(d.value))
						.transition(200)
						.style('opacity', 1);

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
var colorscale = d3.scale.category10();
//Legend titles
var LegendOptions = [this.data.hero.name,'AVG HERO'];
//Data
//console.log("this.data: " + JSON.stringify(this.data));
var data = [
		  [
  			{axis: "STR", value: this.data.hero.growthstats.str},
  			{axis: "INT", value: this.data.hero.growthstats.int},
  			{axis: "AGI", value: this.data.hero.growthstats.agi}
		  ],[
        {axis: "STR", value: 3.3},
  			{axis: "INT", value: 3.6},
  			{axis: "AGI", value: 3.1}
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: dim,
  h: dim,
  maxValue: 6,
  levels: 6,
  ExtraWidthX: 0 //300
};

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", data, mycfg);
};
