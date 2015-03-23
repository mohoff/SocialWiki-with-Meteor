Template.adminAddHero.helpers({
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
    $('.inputSkill' + skillId + ' .inputSkillStatsContainer .inputSkillStatsRow:last').remove();
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
