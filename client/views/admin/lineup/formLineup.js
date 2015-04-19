Template.formLineup.helpers({
  skillColor : function(skillOrder){
    var index = skillOrder - 1;
    var alphaFactor = 0.5;
    //console.log("skillOrder: " + indexToColor[index]);
    return 'color: rgba(' + colorArray[indexToColor[index]] + ', ' + alphaFactor + ') !important;';
  },
  selected : function(type){
    // type = [STR,INT,AGI]
/*
    if(this && this.levelColor){
      // we are in EDIT
      //console.log("actualHeroType: " + this.type + ", inputType: " + type);
      if(this.type === type){
        return "checked";
      } else {
        return;
      }
    } else {
      // we are in ADD
      return;
    }*/
  },
  stringified : function(number){
    return number.toString();
  }
});


Template.formLineup.rendered = function(){
	/* set levelColor-<select> color */
	$('#inputLevelColor').change(function() {
		var style = $('#inputLevelColor option:selected').attr('style');
		console.log("STYLE: " + JSON.stringify(style));
	}).change();


  /* add Synergy */
  $(".addSynergyButton").click(function(){
    /*if(($('#inputSynergies .inputSynergyWrapper').length) > 5){
      alert("Only 5 initial Synergies allowed");
      return false;
    }*/
    var statId = ($('#inputSynergies .inputSynergyWrapper').length + 1).toString();
    $('#inputSynergies').append(
      //'<textarea class="form-control inputSynergy" rows="2" aria-describedby="helpSynergies" placeholder="See examples below. Please keep it as short as possible."></textarea>'
      '<div class="row inputSynergyWrapper">' +
        '<div class="col-xs-6">' +
          '<textarea class="form-control inputSynergy" rows="2" aria-describedby="helpAttributes" placeholder="See examples below. Please keep it as short as possible."></textarea>' +
        '</div>' +
        '<div class="col-xs-6">' +
          'Status: TBD<br />' +
          'Votes: 0<br />' +
          'DeleteRequests: 0<br />' +
        '</div>' +
      '</div>'
    );
  });

  /* remove Synergy */
  var that = this;
  $(".removeSynergyButton").click(function(){
    //var skillId = $(this).attr('data-id');
    /*if($('#inputSynergies .inputSynergy').length == 1){
      alert("You can't remove all Synergies. Enter at least one.");
      return false;
    }*/
    var numberOfCurrentSynergies = $('#inputSynergies .inputSynergyWrapper').length;

    if(that.data && that.data.synergies && that.data.synergies.length){
      // we are in EDIT
      numberOfSavedSynergies = that.data.synergies.length || Session.get('numberOfSavedSynergies');
      Session.set('numberOfSavedSynergies', numberOfSavedSynergies);
      if(numberOfCurrentSynergies > numberOfSavedSynergies){
        $('#inputSynergies .inputSynergyWrapper:last').remove();
      } else {
        alert("You can't delete more Synergies.");
      }
    } else {
      if(numberOfCurrentSynergies > 1){
        $('#inputSynergies .inputSynergyWrapper:last').remove();
      } else {
        alert("You can't delete more Synergies.");
      }
    }
  });

};

Template.formLineup.onDestroyed = function(){
  // doesn't get fired, but also not needed right now
  Session.set('numberOfSavedSynergies', null);
  console.log("Template addOrEditForm destroyed!");
};

Template.formLineup.events({
  "submit form": function (event) {   // form as html-tag identifier
    event.preventDefault();

    var heroes = [];
    if($('#inputHeroes').val() !== ''){
      //heroes = $('#inputHeroes').val().replace(/\s+/g,"").split(",");
			heroes = $('#inputHeroes').val().split(",");
    }
    heroes = cleanArray(heroes);
    
		console.log("die eingegebenen Heroes: " + JSON.stringify(heroes));
		var matchedHeroes = Heroes.find({
			"hero.name": {
				$in: heroes
			}
	 	});
		var orderToName = {}, sortedHeroes = [], unsortedHeroes = [], finalHeroArray = [];
		if(matchedHeroes.count() == 5){		
			matchedHeroes.forEach(function(matchedHero){
				if(matchedHero.hero.lineuporder){
					sortedHeroes.push(matchedHero.hero.lineuporder);
					orderToName[matchedHero.hero.lineuporder] = matchedHero.hero.name;
				} else {
					unsortedHeroes.push(matchedHero.hero.name);
				}
			});
			sortedHeroes.sort();
			for(var i=0; i<unsortedHeroes.length; i++){
				finalHeroArray.push(unsortedHeroes[i]);
			}
			for(var i=0; i<sortedHeroes.length; i++){
				finalHeroArray.push(orderToName[sortedHeroes[i]]);
			}
			//console.log("SORTED HEROES: " + JSON.stringify(finalHeroArray));


			var name = $('#inputName').val();
		  var namenormalized = UI._globalHelpers['normalizeString'](name);
		  var levelColor = $('#inputLevelColor option:selected').text();
		  
		  /*	be careful with other synergy.properties:d
		  		if you overwrite synergy.name, all other properties will be maintained
		  		possibility: also display createdBy, createdAt, deleteRequests, votes, etc.
					with the option to delete those in the UI.
			*/
		  var synergies = [];
		  var synergyRows = $('#inputSynergies .inputSynergyWrapper .inputSynergy');

		  $(synergyRows).each(function(i,elem){
		    if($(this).val() !== ''){
		      synergies.push({
		        name: $(this).val()
		      });
		    }
		  });
		  //console.log("synergies: " + JSON.stringify(synergies));

		  /* composition of Lineup.lineup */
		  lineupData = {};
		  lineupData.name = name;
		  lineupData.levelColor = levelColor;
		  lineupData.heroes = sortedHeroes;
		  lineupData.synergies = synergies;

			var canBeUpdate = false;
			if(isAdmin()){
				canBeUpdate = true;
			}
		  Meteor.call('upsertLineup', lineupData, canBeUpdate, function(err, data){
		    if(err){
		      alert("Server Error");
		    } else {
		      console.log("sucess data: " + JSON.stringify(data));
		      alert("Success");
		    }
		  });


		} else {
			console.log("Heroes list is invalid. Only matched " + matchedHeroes.count() + " Heroes");
			return;
		}
  }
});
