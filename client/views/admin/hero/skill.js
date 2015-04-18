Template.skill.helpers({
  skillColor : function(skillOrder){
    var index = skillOrder - 1;
    var alphaFactor = 0.5;
    console.log("skillOrder: " + indexToColor[index]);
    return 'color: rgba(' + colorArray[indexToColor[index]] + ', ' + alphaFactor + ');';
  },

  isFifthSkill : function(){
    if(this.order == 5){
      return true;
    }
    return false;
  },

  isFifthSkillRequiredString : function(){
    //console.log("THIS: " + JSON.stringify(this));
    //console.log("THIS.ORDER: " + this.order);
    if(this.order == 5){
      return;
    }
    return "required";
  }

});
