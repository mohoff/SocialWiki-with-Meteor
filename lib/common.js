Heroes = new Mongo.Collection("heroes");

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// not needed apparently, because mongodb stores it dates in millis
convertDateToUTC = function(date) {
  return new Date(date.getUTCFullYear(),
                  date.getUTCMonth(),
                  date.getUTCDate(),
                  date.getUTCHours(),
                  date.getUTCMinutes(),
                  date.getUTCSeconds()
  );
};

isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

isAdmin = function(){
  if(Meteor.user() && (Meteor.user().username === 'mohoff')){
    return true;
  } else {
    return false;
  }
};

getCurrentPath = function(){
    // apparently these dot-notations change now and then...
    // template name: Router.current().route.getName()
    // url path: Router.current().location.get().path
    return Router.current().location.get().path;
};

getLastFragmentFromCurrentPath = function(){
  var path = getCurrentPath();
  var pathFragments = path.split('/');
  var normalizedCategory = pathFragments[pathFragments.length-1];
  return normalizedCategory;
};

UI.registerHelper('getNormalizedRankingCategory', function() {
  return getLastFragmentFromCurrentPath();
});

UI.registerHelper('getRankingCategory', function() {
  var lastFragment = getLastFragmentFromCurrentPath();

  var pretty;
  if(lastFragment === 'arena'){
    pretty = 'Arena';
  } else if(lastFragment === 'crusade'){
    pretty = 'Crusade';
  } else if(lastFragment === 'pvefarming'){
    pretty = 'PvE & Farming';
  }
  return pretty;
});

formatDate = function(date){
  var day = parseInt(date.getDate());
  var daySuffix;
  if(day === 0){
    daySuffix = "st";
  } else if(day == 1){
    daySuffix = "nd";
  } else if(day == 2){
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  var result = date.getDate() +
                daySuffix + " of " +
                monthNames[date.getMonth()] + " " +
                date.getFullYear() + ", " +
                date.getHours() + ":" +
                date.getMinutes();
  return result;
};

userData = function(userId){
  //console.log("USERID: " + userId);
  var result = Meteor.users.find(
  {_id: userId},
  {fields: {
    'userdata.login.lastLoginAt': 1,
    'userdata.login.consecutiveLogins': 1,
    'userdata.voting.currentVotePower': 1,
    'userdata.voting.initialVoteBonus': 1
    }
  });
  //console.log("RESULT: " + result._id);
  return result;
};

Meteor.methods({
  vote: function(hero, user, voteFor, upOrDown){
    // available: hero, Heroes, voteFor (crusade,pve,etc)
    console.log("- START of vote");
    var voteSource, votePower;
    var ip = (this.connection && this.connection.clientAddress) || Session.get('clientIp');

    //if(!this.connection.clientAddress){
    //// ERROR: pls connect to the internet
    //}

    var userIdentifier;
    if(user){
      userIdentifier = user._id;
      voteSource = 'R';
      if(user.currentVotePower){// && user.initialVoteBonus){
        votePower = user.currentVotePower;// + user.initialVoteBonus;
      } else {
        votePower = 5;
      }
    } else {
      userIdentifier = ip;
      voteSource = 'Unr';
      votePower = 1;
    }

    if(!isNumber(votePower)){
      return null; // cancel vote
      // throw error
    }

    // undo eventual "opposite"-votes
    if(upOrDown == 'up'){
      Meteor.call('unvote', hero, user, voteFor, 'down');
    } else if(upOrDown == 'down'){
      Meteor.call('unvote', hero, user, voteFor, 'up');
    }

    console.log("userIdentifier: " + userIdentifier);
    var modifier = { $ne: userIdentifier };
    var sub_isInArray = {};
    sub_isInArray._id = hero._id;
    sub_isInArray['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = modifier;

    var sub_addToSet = {};
    sub_addToSet['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountDaily'] = votePower;

    // affected returns 0 or 1, depending on if record got updated or not
    var affected = Heroes.update(
      sub_isInArray,
    {
      $addToSet: sub_addToSet,
      $inc: sub_vote
    });

    console.log("-- AFFECTED beim " + upOrDown + "vote: " + affected);
    // undo upvote if previous update didn't affect anything
    if(affected != 1){
      // undo upvote
      console.log("-- start UNDO " + upOrDown + "vote");
      Meteor.call('unvote', hero, user, voteFor, upOrDown);
      // throw new Meteor.Error('invalid', "You weren't able to upvote that post");
    }
    console.log("- END of vote");
    return userIdentifier;
  },

  unvote: function(hero, user, voteFor, upOrDown){
    // not DRY because very similar stuff happens for Meteor-method 'upvote'
    console.log("-- START of unvote");
    var voteSource, votePower;
    var ip = (this.connection && this.connection.clientAddress) || Session.get('clientIp');

    var userIdentifier;
    if(user){
      userIdentifier = user._id;
      voteSource = 'R';
      if(user.currentVotePower){// && user.initialVoteBonus){
        votePower = -user.currentVotePower;// + user.initialVoteBonus;
      } else {
        votePower = 5;
      }
    } else {
      userIdentifier = ip;
      voteSource = 'Unr';
      votePower = -1;
    }

    if(!isNumber(votePower)){
      return null; // cancel vote
      // throw error
    }

    var sub_isInArray = {};
    sub_isInArray._id = hero._id;
    sub_isInArray['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = userIdentifier;

    var sub_addToSet = {};
    sub_addToSet['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountDaily'] = votePower;

    var affected = Heroes.update(
      sub_isInArray,
    {
      $pull: sub_addToSet,
      $inc: sub_vote
    });

    console.log("--- AFFECTED beim UNDO " + upOrDown + "vote: " + affected);
    console.log("-- END of unvote");
  }

});
