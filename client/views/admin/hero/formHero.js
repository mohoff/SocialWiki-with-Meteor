Template.formHero.helpers({
  skillColor : function(skillOrder){
    var index = skillOrder - 1;
    var alphaFactor = 0.5;
    //console.log("skillOrder: " + indexToColor[index]);
    return 'color: rgba(' + colorArray[indexToColor[index]] + ', ' + alphaFactor + ');';
  },
  checked : function(type){
    // type = [STR,INT,AGI]

    if(this && this.type){
      // we are in EDIT
      console.log("actualHeroType: " + this.type + ", inputType: " + type);
      if(this.type === type){
        return "checked";
      } else {
        return;
      }
    } else {
      // we are in ADD
      return;
    }
  },
  stringified : function(number){
    return number.toString();
  }
  /*dateForInput : function(dbInput){
    console.log("dbinput date: " + dbInput);
    $('#inputRelease').datepicker('method', arg1);
    return dbInput;
  }*/
});


Template.formHero.rendered = function(){
  // init date picker
  $('#inputRelease').datepicker({
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
  });
  if(this.data && this.data.releasedAt){
    var date = this.data.releasedAt;
    $('#inputRelease').datepicker('setUTCDate', date);
  }


  /* add Skill-Stat */
  $(".addButton").click(function(){
    var skillId = $(this).attr('data-id');
    console.log("skillId: " + skillId); // 1,2,3,4,(5)
    if(($('#inputSkill' + skillId + ' .inputSkillStatsContainer .inputSkillStatsRow').length+1) > 5){
      alert("Only 5 Stats allowed");
      return false;
    }
    var statId = ($('#inputSkill' + skillId + ' .inputSkillStatsContainer .inputSkillStatsRow').length + 1).toString();
    $('#inputSkill' + skillId + ' .inputSkillStatsContainer').append(
      '<div class="inputSkillStatsRow">' +
        '<div class="col-xs-4 left-input">' +
          '<input type="text" class="form-control statsName" placeholder="e.g. Damage, Hitzone">' +
        '</div>' +
        '<div class="col-xs-4 middle-input">' +
          '<input type="text" class="form-control statsLvl1" placeholder="e.g. 40">' +
        '</div>' +
      '<div class="col-xs-4 right-input">' +
          '<input type="text" class="form-control statsPerLvl" placeholder="e.g. 12, Increase">' +
        '</div>' +
      '</div>'
    );
  });

  /* remove Skill-Stat */
  $(".removeButton").click(function(){
    var skillId = $(this).attr('data-id');
    if($('.inputSkill' + skillId + ' .inputSkillStatsContainer .inputSkillStatsRow').length == 1){
      alert("You can't remove all Stats. Enter at least one.");
      return false;
    }
    $('#inputSkill' + skillId + ' .inputSkillStatsContainer .inputSkillStatsRow:last').remove();
  });

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

/* // LEGACY

    var numberOfSavedSynergies = 0;
    if((that.data.synergies && that.data.synergies.length) || (Session.get('numberOfSavedSynergies'))){
      console.log("WE HAVE # OF SAVED SYNS");
      numberOfSavedSynergies = that.data.synergies.length || Session.get('numberOfSavedSynergies');
      Session.set('numberOfSavedSynergies', numberOfSavedSynergies);
    }

    if(that.data && that.data.synergies && that.data.synergies.length &&
        (numberOfCurrentSynergies > numberOfSavedSynergies)){
      $('#inputSynergies .inputSynergyWrapper:last').remove();
    } else {
      alert("You can't delete more Synergies.");
    }
*/
  });

};

Template.formHero.onDestroyed = function(){
  // doesn't get fired, but also not needed right now
  Session.set('numberOfSavedSynergies', null);
  console.log("Template addOrEditForm destroyed!");
};

Template.formHero.events({
  "submit form": function (event) {   // form as html-tag identifier
    event.preventDefault();

    var releasedAt = $('#inputRelease').datepicker('getUTCDate');
    console.log("getUTCDtae: " + releasedAt);
    var name = $('#inputName').val();
    var namenormalized = UI._globalHelpers['normalizeString'](name);
    var surname = $('#inputSurname').val();
    var desc = $('#inputDescription').val();
    var type = $('.inputTypeWrapper input:radio[name=type]:checked').val();
    console.log("type: " + type);

    var stats = {};
    stats.base = {};
    stats.base.str = $('#inputBasestatSTR').val();
    stats.base.int = $('#inputBasestatINT').val();
    stats.base.agi = $('#inputBasestatAGI').val();
    stats.base.hp = $('#inputSecondaryStatHP').val() || 0;
    stats.base.armor = $('#inputSecondaryStatArmor').val() || 0;
    stats.base.mres = $('#inputSecondaryStatMagicRes').val() || 0;
    stats.base.ad = $('#inputSecondaryStatAttackPower').val() || 0;
    stats.base.ap = $('#inputSecondaryStatMagicPower').val() || 0;
    stats.base.crit = $('#inputSecondaryStatPhysCrit').val() || 0;
    //console.log("mres: " + $('#inputSecondaryStatMagicRes').val());
    var growthStatsObservationStars = parseFloat($('#inputGrowthstatsStars').val());
    //console.log("GROWTHSTAT Observation stars: " + growthStatsObservationStars);
    //console.log("preTEST: " + parseFloat($('#inputGrowthstatsSTR').val()));
    //console.log("TEST: " + parseFloat($('#inputGrowthstatsSTR').val()) / (growthStatsObservationStars+1));
    stats.growth = {};
    stats.growth.str = (parseFloat($('#inputGrowthstatsSTR').val()) / (growthStatsObservationStars+1));
    stats.growth.int = (parseFloat($('#inputGrowthstatsINT').val()) / (growthStatsObservationStars+1));
    stats.growth.agi = (parseFloat($('#inputGrowthstatsAGI').val()) / (growthStatsObservationStars+1));

    var lineuporder = $('#inputOrder').val();

    var badges = [];
    if($('#inputBadges').val() !== ''){
      badges = $('#inputBadges').val().replace(/\s+/g,"").split(",");
    }
    badges = cleanArray(badges);
    //console.log("badges: " + JSON.stringify(badges));
    var attributes = [];
    if($('#inputAttributes').val() !== ''){
      attributes = $('#inputAttributes').val().replace(/\s+/g,"").split(",");
    }
    attributes = cleanArray(attributes);
    //console.log("attributes: " + JSON.stringify(attributes));

    var skills = [];
    for(var i=0; i<5; i++){
      var skillStats = [];
      var statRows = $('#inputSkill' + (i+1) + ' .inputSkillStatsRow');
      $(statRows).each(function(){
        //console.log("TEST1: " + $(this));
        //console.log("TEST2: " + JSON.stringify($(this)));
        //console.log("TEST3: " + $(this).find('.statsName').val());
        var statsType = $(this).find('.statsName').val();
        if(statsType !== ''){
          skillStats.push({
            type: statsType,
            lvl1: $(this).find('.statsLvl1').val(),
            perLvl: $(this).find('.statsPerLvl').val()
          });
        }
      });


      var skillTypes = [];
      if($('#inputSkill' + (i+1) + ' #inputSkillType').val() !== ''){
        skillTypes = $('#inputSkill' + (i+1) + ' #inputSkillType').val().replace(/\s+/g,"").split(",");
      }
      skillTypes = cleanArray(skillTypes);

      skills.push({
        order: i+1,
        name: $('#inputSkill' + (i+1) + ' #inputSkillName').val(),
        desc: $('#inputSkill' + (i+1) + ' #inputSkillDesc').val(),
        types: skillTypes,
        stats: skillStats
      });
    }
    console.log("skills: " + JSON.stringify(skills));


    // be careful with other synergy.properties:d
    // if you overwrite synergy.name, all other properties will be maintained
    // possibility: also display createdBy, createdAt, deleteRequests, votes, etc. with the option to delete those in the UI.
    var synergies = [];
    var synergyRows = $('#inputSynergies .inputSynergyWrapper .inputSynergy');

    $(synergyRows).each(function(i,elem){
      if($(this).val() !== ''){
        synergies.push({
          name: $(this).val()
        });
      }
    });
    console.log("synergies: " + JSON.stringify(synergies));


    /* composition of Hero.hero */
    heroData = {};
    heroData.releasedAt = releasedAt;
    heroData.name = name;
    heroData.namenormalized = namenormalized;
    heroData.surname = surname;
    heroData.desc = desc;
    heroData.type = type;
    heroData.stats = stats;
    heroData.lineuporder = lineuporder;
    heroData.badges = badges;
    heroData.attributes = attributes;
    heroData.skills = skills;
    heroData.synergies = synergies;

    Meteor.call('upsertHero', heroData, function(err, data){
      if(err){
        alert("Server Error");
      } else {
        console.log("sucess data: " + JSON.stringify(data));
        alert("Success");
      }
    });

    //return false;
  }
});
