Template.registerHelper("initialVoteBonus",function(value){
  if(Meteor.user() && Meteor.user().userdata && Meteor.user().userdata.voting &&
      Meteor.user().userdata.voting.initialVoteBonus){
    return Meteor.user().userdata.voting.initialVoteBonus;
  } else {
    return 1; // for unregistered users, votePower = 1
  }
});

Template.registerHelper("scoreHeroRankings", function(hero){
  var category = UI._globalHelpers['getNormalizedRankingCategory']();
  if(hero && hero.hero && hero.hero.ratings && hero.hero.ratings[category] &&
      hero.hero.ratings[category]){

    if(hero.hero.ratings[category].upvoteCountAlltime && hero.hero.ratings[category].downvoteCountAlltime){
      var upPoints = hero.hero.ratings[category].upvoteCountAlltime;
      var downPoints = hero.hero.ratings[category].downvoteCountAlltime;
      var score = upPoints - downPoints;
      return score;
    }
    if(hero.hero.ratings[category].upvoteCountAlltime){
      return hero.hero.ratings[category].upvoteCountAlltime;
    }
    if(hero.hero.ratings[category].downvoteCountAlltime){
      return -hero.hero.ratings[category].downvoteCountAlltime;
    }
  }
  return 0;
});

Template.registerHelper("scoreHeroDetails", function(hero, category){
  if(hero && hero.hero && hero.hero.ratings && hero.hero.ratings[category] &&
      hero.hero.ratings[category]){

    if(hero.hero.ratings[category].upvoteCountAlltime && hero.hero.ratings[category].downvoteCountAlltime){
      var upPoints = hero.hero.ratings[category].upvoteCountAlltime;
      var downPoints = hero.hero.ratings[category].downvoteCountAlltime;
      var score = upPoints - downPoints;
      return score;
    }
    if(hero.hero.ratings[category].upvoteCountAlltime){
      return hero.hero.ratings[category].upvoteCountAlltime;
    }
    if(hero.hero.ratings[category].downvoteCountAlltime){
      return hero.hero.ratings[category].downvoteCountAlltime;
    }
  }
  return 0;
});

Template.registerHelper("srcPathAvatar", function(hero){
  var normalizedName = UI._globalHelpers['normalizeString'](hero.hero.name);

  //console.log(normalizedName);
  var path = "/img_heroes/" + normalizedName + "/artwork.jpg";
  //console.log("PATHTOAVATAR: " + path);
  return path;
});

Template.registerHelper("srcPathType", function(hero){
  var type = hero.hero.type.toLowerCase();
  return '/img_herotypes/' + type + '.png';
});


/*
upvotes: function(){
  var category = UI._globalHelpers['getNormalizedRankingCategory']();
  var points = this.hero.ratings[category].upvoteCountAlltime;
  return points;
},

downvotes: function(){
  var category = UI._globalHelpers['getNormalizedRankingCategory']();
  console.log("Category: " + category);

  var points = this.hero.ratings[category].downvoteCountAlltime;
  console.log("Downvotes: " + points);
  return points;
},

score: function(){
  var category = UI._globalHelpers['getNormalizedRankingCategory']();
  var upPoints = this.hero.ratings[category].upvoteCountAlltime;
  var downPoints = this.hero.ratings[category].downvoteCountAlltime;
  var score = upPoints - downPoints;
  return score;
},

scoreDiff: function(){
  var userId, voteFor, voteSource, userIdentifier, votePower, upOrDownOrUnvote;
  userId = Meteor.userId();
  voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

  if(userId){
    voteSource = 'R';
    userIdentifier = userId;
  } else {
    voteSource = 'Unr';
    userIdentifier = Session.get('clientIp');
  }
  // helper receives e.g. nested rating.crusade object, and checks if it contains the passed userIdentifier
  upOrDownOrUnvote = UI._globalHelpers['upOrDownOrUnvote'](this.hero.ratings[voteFor], userIdentifier);

  if(Meteor.user() &&
      Meteor.user().userdata &&
      Meteor.user().userdata.voting &&
      Meteor.user().userdata.voting.currentVotePower){
    votePower = Meteor.user().userdata.voting.currentVotePower.toString();
  } else {
    votePower = "1";
  }
  var prefix;

  if(upOrDownOrUnvote == 'up'){
    prefix = '+';
  } else if(upOrDownOrUnvote == 'down'){
    prefix = '-';
  } // else if(upOrDownOrUnvote == 'unvote'){
    // do nothing
  //}
  return prefix + votePower;
},

scoreDiffStyle: function(){
  var userId, voteFor, voteSource, userIdentifier, votePower, upOrDownOrUnvote;
  userId = Meteor.userId();
  voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

  if(userId){
    voteSource = 'R';
    userIdentifier = userId;
  } else {
    voteSource = 'Unr';
    userIdentifier = Session.get('clientIp');
  }
  // helper receives e.g. nested rating.crusade object, and checks if it contains the passed userIdentifier
  upOrDownOrUnvote = UI._globalHelpers['upOrDownOrUnvote'](this.hero.ratings[voteFor], userIdentifier);

  var classes;
  if(upOrDownOrUnvote == 'up'){
    classes = 'green';
  } else if(upOrDownOrUnvote == 'down'){
    classes = 'red';
  } else if(upOrDownOrUnvote == 'unvote'){
    classes = 'gone';
  }
  return classes;
},*/
