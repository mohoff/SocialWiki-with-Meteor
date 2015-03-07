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

formatDate = function(date){
  var day = parseInt(date.getDate());
  var daySuffix;
  if(day == 0){
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
    'lastLoginAt': 1,
    'consecutiveLogins': 1,
    'currentVoteBonus': 1,
    'initialVoteBonus': 1
    }
  });
  //console.log("RESULT: " + result._id);
  return result;
};

Meteor.methods({
  vote: function(hero, user, voteFor, upOrDown){
    // available: hero, Heroes, voteFor (crusade,pve,etc)
    var voteSource, votePower;

    var userIdentifier;
    if(user){
      userIdentifier = user._id;
      voteSource = 'R';
      votePower = user.currentVoteBonus + user.initialVoteBonus;
    } else {
      userIdentifier = this.connection.clientAddress;
      voteSource = 'Unr';
      votePower = 1;
    }

    // undo eventual downvote

    var modifier = { $ne: userIdentifier };
    var sub_isInArray = {};
    sub_isInArray['_id'] = hero._id;
    sub_isInArray['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = modifier;

    var sub_addToSet = {};
    sub_addToSet['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountDaily'] = votePower;

    // affected returns 0 or 1, depending on if record got updated or not
    var affected = Heroes.update(
      sub_isInArray
    , {
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
  },

  unvote: function(hero, user, voteFor, upOrDown){
    // not DRY because very similar stuff happens for Meteor-method 'upvote'
    var voteSource, votePower;

    var userIdentifier;
    if(user){
      userIdentifier = user._id;
      voteSource = 'R';
      votePower = -(user.currentVoteBonus + user.initialVoteBonus);
    } else {
      userIdentifier = this.connection.clientAddress;
      voteSource = 'Unr';
      votePower = -1;
    }

    var sub_isInArray = {};
    sub_isInArray['_id'] = hero._id;
    sub_isInArray['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = userIdentifier;

    var sub_addToSet = {};
    sub_addToSet['hero.ratings.'+voteFor+'.'+upOrDown+'votersDaily'+voteSource+'egistered'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+upOrDown+'voteCountDaily'] = votePower;

    var affected = Heroes.update(
      sub_isInArray
    , {
      $pull: sub_addToSet,
      $inc: sub_vote
    });

    console.log("-- AFFECTED beim UNDO " + upOrDown + "vote: " + affected);
  }

});
