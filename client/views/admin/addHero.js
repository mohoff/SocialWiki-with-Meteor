Template.adminAddHero.helpers({
  skillColor : function(skillOrder){
    var index = skillOrder - 1;
    var alphaFactor = 0.5;
    console.log("skillOrder: " + indexToColor[index]);
    return 'color: rgba(' + colorArray[indexToColor[index]] + ', ' + alphaFactor + ');';
  }

});


Template.adminAddHero.rendered = function(){

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
    if(($('#inputSynergies .inputSynergy').length+1) > 5){
      alert("Only 5 initial Synergies allowed");
      return false;
    }
    var statId = ($('#inputSynergies .inputSynergy').length + 1).toString();
    $('#inputSynergies').append(
      '<textarea class="form-control inputSynergy" rows="2" aria-describedby="helpSynergies" placeholder="See examples below. Please keep it as short as possible."></textarea>'
    );
  });

  /* remove Synergy */
  $(".removeSynergyButton").click(function(){
    var skillId = $(this).attr('data-id');
    if($('#inputSynergies .inputSynergy').length == 1){
      alert("You can't remove all Synergies. Enter at least one.");
      return false;
    }
    $('#inputSynergies .inputSynergy:last').remove();
  });

};


Template.adminAddHero.events({
  "submit form": function (event) {   // form as html-tag identifier
    event.preventDefault();

    var name = $('#inputName').val();
    var surname = $('#inputSurname').val();
    var type = $('.inputTypeWrapper input:radio[name=type]:checked').val();
    console.log("type: " + type);

    var stats = {};
    stats.base = {};
    stats.base.str = $('#inputBasestatSTR').val();
    stats.base.int = $('#inputBasestatINT').val();
    stats.base.agi = $('#inputBasestatAGI').val();
    stats.base.hp = $('#inputSecondaryStatHP').val();
    stats.base.armor = $('#inputSecondaryStatArmor').val();
    stats.base.mres = $('#inputSecondaryStatMagicRes').val();
    stats.base.ad = $('#inputSecondaryStatAttackPower').val();
    stats.base.ap = $('#inputSecondaryStatMagicPower').val();
    stats.base.crit = $('#inputSecondaryStatPhysCrit').val();

    stats.initialGrowth = {};
    stats.initialGrowth.str = $('#inputGrowthstatsSTR').val();
    stats.initialGrowth.int = $('#inputGrowthstatsINT').val();
    stats.initialGrowth.agi = $('#inputGrowthstatsAGI').val();

    var lineuporder = $('#inputOrder').val();

    var badges = [];
    if($('#inputBadges').val() !== ''){
      badges = $('#inputBadges').val().replace(/\s+/, "").split(",");
    }
    console.log("badges: " + JSON.stringify(badges));
    var attributes = [];
    if($('#inputAttributes').val() !== ''){
      attributes = $('#inputAttributes').val().replace(/\s+/, "").split(",");
    }
    //attributes = $('#inputAttributes').val().replace(/\s+/, "").split(",");
    console.log("attributes: " + JSON.stringify(attributes));

    var skills = [];
    for(var i=0; i<5; i++){
      var skillstats = [];
      var statRows = $('#inputSkill' + (i+1) + ' .inputSkillStatsRow');
      $(statRows).each(function(){
        //console.log("TEST1: " + $(this));
        //console.log("TEST2: " + JSON.stringify($(this)));
        //console.log("TEST3: " + $(this).find('.statsName').val());
        var statsType = $(this).find('.statsName').val();
        if(statsType !== ''){
          skillstats.push({
            type: statsType,
            lvl1: $(this).find('.statsLvl1').val(),
            perLvl: $(this).find('.statsPerLvl').val()
          });
        }
      });

      var skillTypes = [];
      if($('#inputSkill' + (i+1) + ' #inputSkillType').val() !== ''){
        skillTypes = $('#inputSkill' + (i+1) + ' #inputSkillType').val().replace(/\s+/, "").split(",");
      }
      skills.push({
        order: i+1,
        name: $('#inputSkill' + (i+1) + ' #inputSkillName').val(),
        desc: $('#inputSkill' + (i+1) + ' #inputSkillDesc').val(),
        types: skillTypes,
        stats: skillstats
      });
    }
    console.log("skills: " + JSON.stringify(skills));

    var synergies = [];
    var synergyRows = $('#inputSynergies .inputSynergy');
    $(synergyRows).each(function(){
      if($(this).val() !== ''){
        synergies.push({
          name: $(this).val()
        });
      }
    });
    console.log("synergies: " + JSON.stringify(synergies));


    /* composition of Hero.hero */
    heroData = {};
    heroData.name = name;
    heroData.surname = surname;
    heroData.type = type;
    heroData.stats = stats;
    heroData.lineuporder = lineuporder;
    heroData.badges = badges;
    heroData.attributes = attributes;
    heroData.skills = skills;
    heroData.synergies = synergies;

    Meteor.call('upsertHero', heroData);

    //return false;
  }
});
