Heroes = new Mongo.Collection("heroes");
Lineups = new Mongo.Collection("lineups");

/* Schema Model stuff */
Schemas = {};
adminArray = [''];
allowedTypes = ['STR', 'INT', 'AGI'];
allowedLevelColors = ['Grey', 'Green', 'Blue', 'Purple', 'Orange'];




var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/*
    // not offical, just colorpicked from ingame screenshots
    gray:   #858384 = rgb(133,131,132)
    green:  #3DA441 = rgb(61,164,65)
    blue:   #239BDF = rgb(35,155,223)
    purple: #C323DF = rgb(195,35,223)
    yellow: #E08119 = rgb(224,129,25)
*/
colorArray = {};
colorArray['gray'] = '133,131,132';
colorArray['green'] = '61,164,65';
colorArray['blue'] = '35,155,223';
colorArray['purple'] = '195,35,223';
colorArray['orange'] = '224,129,25';
indexToColor = ['gray', 'green', 'blue', 'purple', 'orange'];


colorTypeArray = {};
colorTypeArray['STR'] = '201,25,32'; // #c92317
colorTypeArray['INT'] = '42,101,197'; // #2a65c5
colorTypeArray['AGI'] = '53,173,15'; // #35ad0f


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

UI.registerHelper('isAdmin', function(){
  return isAdmin();
});

capitalizeEachWordInString = function(input){
  return input.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

normalizeString = function(unnormed){
  //console.log("input: " + unnormed);
  return unnormed.trim().replace(/\s+/g,"-").toLowerCase();
  //return normed.replace(/\s+/g,"-").toLowerCase();
};
UI.registerHelper("normalizeString", function(input){
  return normalizeString(input);
});

unnormalizeString = function(normed){
  var unnormed = normed.replace(/-/g,' ');
  return capitalizeEachWordInString(unnormed);
}

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

cleanArray = function(actual){
  var newArray = new Array();
  for(var i=0; i<actual.length; i++){
    if (actual[i]){
      newArray.push(actual[i].trim());		// trim() added afterwards
    }
  }
  return newArray;
};

sortHeroesArray = function(heroesArray, cat){
	heroesArray.sort(function(a,b){
		if(a.hero && a.hero.ratings && a.hero.ratings[cat] && a.hero.ratings[cat].upvoteCountAlltime &&
                b.hero && b.hero.ratings && b.hero.ratings[cat] && b.hero.ratings[cat].upvoteCountAlltime){
			var scoreA = a.hero.ratings[cat].upvoteCountAlltime - a.hero.ratings[cat].downvoteCountAlltime;
			var scoreB = b.hero.ratings[cat].upvoteCountAlltime - b.hero.ratings[cat].downvoteCountAlltime;
      return scoreB - scoreA;
    }
    if((a.hero && a.hero.ratings && a.hero.ratings[cat] && a.hero.ratings[cat].upvoteCountAlltime) ||
                (b.hero && b.hero.ratings && b.hero.ratings[cat] && b.hero.ratings[cat].downvoteCountAlltime)){
    	return -1;
    }
    if((a.hero && a.hero.ratings && a.hero.ratings[cat] && a.hero.ratings[cat].downvoteCountAlltime) ||
                (b.hero && b.hero.ratings && b.hero.ratings[cat] && b.hero.ratings[cat].upvoteCountAlltime)){
      return 1;
    }
    return 0;
  });
  //console.log("HEROESArraySorted: " + JSON.stringify(heroesArray));
	console.log("CAT: " + cat);
  var score = heroesArray[0].hero.ratings[cat].upvoteCountAlltime - heroesArray[0].hero.ratings[cat].downvoteCountAlltime;

  //console.log("HIGHSCORE: " + score);
  sessionRecord = {};
  sessionRecord[cat + 'RankingHighscore'] = score;
  Session.set(sessionRecord);

	return heroesArray;
};

sortLineupsArray = function(lineupsArray, cat){
	lineupsArray.sort(function(a,b){
		if(a.lineup && a.lineup.ratings && a.hero.lineup.upvoteCountAlltime &&
                b.lineup && b.lineup.ratings && b.lineup.upvoteCountAlltime){
			var scoreA = a.lineup.ratings.upvoteCountAlltime - a.lineup.downvoteCountAlltime;
			var scoreB = b.lineup.ratings.upvoteCountAlltime - b.lineup.downvoteCountAlltime;
      return scoreB - scoreA;
    }
    if((a.lineup && a.lineup.ratings && a.lineup.upvoteCountAlltime) ||
                (b.lineup && b.lineup.ratings && b.lineup.ratings.downvoteCountAlltime)){
    	return -1;
    }
    if((a.lineup && a.lineup.ratings && a.lineup.ratings.downvoteCountAlltime) ||
                (b.lineup && b.lineup.ratings && b.lineup.ratings.upvoteCountAlltime)){
      return 1;
    }
    return 0;
  });
  
  var score = lineupsArray[0].lineup.ratings.upvoteCountAlltime - lineupsArray[0].lineup.ratings.downvoteCountAlltime;

  //console.log("HIGHSCORE: " + score);
  sessionRecord = {};
  sessionRecord['LineupRankingHighscore'] = score;
  Session.set(sessionRecord);

	return lineupsArray;
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

UI.registerHelper('upOrDownOrUnvote', function(obj, userIdentifier) {
	// can be used for both Heroes and Lineups
  //console.log("OBJ:" + JSON.stringify(obj));
  //console.log("userIdentifier: " + userIdentifier);
  //console.log("we are in upOrDownOrUnvote");

  if((obj.upvotersDailyRegistered &&
    _.contains(obj.upvotersDailyRegistered, userIdentifier)) ||
    (obj.upvotersDailyUnregistered &&
    _.contains(obj.upvotersDailyUnregistered, userIdentifier))){
      //console.log('up');
      return 'up';
  }
  if((obj.downvotersDailyRegistered &&
    _.contains(obj.downvotersDailyRegistered, userIdentifier)) ||
    (obj.downvotersDailyUnregistered &&
    _.contains(obj.downvotersDailyUnregistered, userIdentifier))){
      //console.log('down');
      return 'down';
  }
  //console.log('unvote');
  return 'unvote';
});

formatDate = function(date){
  var day = parseInt(date.getDate());
  var daySuffix;
  if(day === 1){
    daySuffix = "st";
  } else if(day == 2){
    daySuffix = "nd";
  } else if(day == 3){
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  var hours = date.getHours();
  if(hours < 10){
    hours = "0" + hours;
  }
  var minutes = date.getMinutes();
  if(minutes < 10){
    minutes = "0" + minutes;
  }

  /*var result = date.getDate() +
                daySuffix + " of " +
                monthNames[date.getMonth()] + " " +
                date.getFullYear() + ", " +
                hours + ":" +
                minutes;*/
  var result = hours + ":" +
                minutes + " - " +
                date.getDate() +
                daySuffix + " of " +
                monthNames[date.getMonth()] + " " +
                date.getFullYear();
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

unsetRatingsFor = function(time){
  // 'time' should be either 'Daily' or 'Monthly'
  if(time != 'Daily' && time != 'Monthly'){
    return;
  }
  console.log("- UNSET ratings because new day/month");

  /* following fields don't exist all for 'Monthly', but $unset-operator
     in the Update will ignore those fields then */

  var sub_unset = {};
  // arena
  sub_unset['hero.ratings.arena.upvoters' + time + 'Registered'] = "";
  sub_unset['hero.ratings.arena.upvoters' + time + 'Unregistered'] = "";
  sub_unset['hero.ratings.arena.upvoteCount' + time] = "";
  sub_unset['hero.ratings.arena.downvoters' + time + 'Unregistered'] = "";
  sub_unset['hero.ratings.arena.downvoters' + time + 'Registered'] = "";
  sub_unset['hero.ratings.arena.downvoteCount' + time] = "";
  // crusade
  sub_unset['hero.ratings.crusade.upvoters' + time + 'Registered'] = "";
  sub_unset['hero.ratings.crusade.upvoters' + time + 'Unregistered'] = "";
  sub_unset['hero.ratings.crusade.upvoteCount' + time] = "";
  sub_unset['hero.ratings.crusade.downvoters' + time + 'Unregistered'] = "";
  sub_unset['hero.ratings.crusade.downvoters' + time + 'Registered'] = "";
  sub_unset['hero.ratings.crusade.downvoteCount' + time] = "";
  // pvefarming
  sub_unset['hero.ratings.pvefarming.upvoters' + time + 'Registered'] = "";
  sub_unset['hero.ratings.pvefarming.upvoters' + time + 'Unregistered'] = "";
  sub_unset['hero.ratings.pvefarming.upvoteCount' + time] = "";
  sub_unset['hero.ratings.pvefarming.downvoters' + time + 'Unregistered'] = "";
  sub_unset['hero.ratings.pvefarming.downvoters' + time + 'Registered'] = "";
  sub_unset['hero.ratings.pvefarming.downvoteCount' + time] = "";

  // returns number of affected entries
  return Heroes.update(
  {}, // update every Hero-collection
  {
    $unset: sub_unset
  });

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

    // reset hero.ratings if new day (daily reset) or new month (monthly reset)
    var currentDate = new Date();
    if(hero.updatedAt && (hero.updatedAt.getDate() != currentDate.getDate())){
      //unsetRatingsFor('Daily');
      if(hero.updatedAt.getMonth() != currentDate.getMonth()){
        //unsetRatingsFor('Monthly');
      }
    }

    var userIdentifier;
    if(user){
      userIdentifier = user._id;
      voteSource = 'R';
      if(user.userdata && user.userdata.voting && user.userdata.voting.currentVotePower){// && user.initialVoteBonus){
        votePower = user.userdata.voting.currentVotePower;// + user.initialVoteBonus;
      } else {
        votePower = 5;
      }
    } else {
      userIdentifier = ip;
      voteSource = 'Unr';
      votePower = 1;
    }

    if(!isNumber(votePower)){
      return; // cancel vote
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
      if(user.userdata && user.userdata.voting && user.userdata.voting.currentVotePower){// && user.initialVoteBonus){
        votePower = -user.userdata.voting.currentVotePower;// + user.initialVoteBonus;
      } else {
        votePower = -5;
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
  },

  voteSynergy: function(user, hero, votedSynergyName){
    // available: hero, Heroes, voteFor (crusade,pve,etc)
    console.log("- START of voteSynergy");
    console.log("-- votedSynergyName: " + votedSynergyName);
    var userIdentifier = user._id;
    var synergyIndex;

    var synergyArray = hero.hero.synergies;
    for(var i=0; i<synergyArray.length; i++){
      if(synergyArray[i].name === votedSynergyName){
        synergyIndex = i;
        break;
      }
    }

    console.log("-- userIdentifier: " + userIdentifier);
    console.log("-- synergyIndex: " + synergyIndex);
    var modifier = { $ne: userIdentifier };
    var sub_isInArray = {};
    sub_isInArray['_id'] = hero._id;
    sub_isInArray['hero.synergies.' + synergyIndex + '.voters'] = modifier;

    var sub_addToSet = {};
    sub_addToSet['hero.synergies.' + synergyIndex + '.voters'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.synergies.' + synergyIndex + '.votes'] = 1;

    // affected returns 0 or 1, depending on if record got updated or not
    var affected = Heroes.update(
      sub_isInArray,
    {
      $addToSet: sub_addToSet,
      $inc: sub_vote
    });

    console.log("-- AFFECTED beim synergyVote: " + affected);
    // undo upvote if previous update didn't affect anything
    if(affected != 1){
      // undo upvote
      console.log("-- start UNDO synergyVote");
      Meteor.call('unvoteSynergy', user, hero, synergyIndex);
    }
    console.log("- END of synergyVote");
    return userIdentifier;
  },

  unvoteSynergy: function(user, hero, synergyIndex){
    // not DRY because very similar stuff happens for Meteor-method 'upvote'
    console.log("-- START of unvoteSynergy");
    var userIdentifier = user._id;

    var sub_isInArray = {};
    sub_isInArray._id = hero._id;
    sub_isInArray['hero.synergies.' + synergyIndex + '.voters'] = userIdentifier;

    var sub_addToSet = {};
    sub_addToSet['hero.synergies.' + synergyIndex + '.voters'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.synergies.' + synergyIndex + '.votes'] = -1;

    var affected = Heroes.update(
      sub_isInArray,
    {
      $pull: sub_addToSet,
      $inc: sub_vote
    });

    console.log("--- AFFECTED beim UNDO SynergyVote: " + affected);
    console.log("-- END of synergyUnvote");
  },

  voteDeleteSynergy: function(user, hero, votedDeleteSynergyName){
    // available: hero, Heroes, voteFor (crusade,pve,etc)
    console.log("- START of voteDeleteSynergy");
    console.log("-- votedDeleteSynergyName: " + votedDeleteSynergyName);
    var userIdentifier = user._id;
    var synergyIndex;
    var synergyArray = hero.hero.synergies;
    for(var i=0; i<synergyArray.length; i++){
      if(synergyArray[i].name === votedDeleteSynergyName){
        synergyIndex = i;
        break;
      }
    }

    console.log("-- userIdentifier: " + userIdentifier);
    console.log("-- synergyIndex: " + synergyIndex);
    var modifier = { $ne: userIdentifier };
    var sub_isInArray = {};
    sub_isInArray['_id'] = hero._id;
    sub_isInArray['hero.synergies.' + synergyIndex + '.deleteVoters'] = modifier;

    var sub_addToSet = {};
    sub_addToSet['hero.synergies.' + synergyIndex + '.deleteVoters'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.synergies.' + synergyIndex + '.deleteVotes'] = 1;

    // affected returns 0 or 1, depending on if record got updated or not
    var affected = Heroes.update(
      sub_isInArray,
    {
      $addToSet: sub_addToSet,
      $inc: sub_vote
    });

    console.log("-- AFFECTED beim synergyDeleteVote: " + affected);
    // undo upvote if previous update didn't affect anything
    if(affected != 1){
      // undo upvote
      console.log("-- start UNDO synergyDeleteVote");
      Meteor.call('unvoteDeleteSynergy', user, hero, synergyIndex);
    }
    console.log("- END of synergyDeleteVote");
    return userIdentifier;
  },

  unvoteDeleteSynergy: function(user, hero, synergyIndex){
    // not DRY because very similar stuff happens for Meteor-method 'upvote'
    console.log("-- START of unvoteDeleteSynergy");
    var userIdentifier = user._id;

    var sub_isInArray = {};
    sub_isInArray._id = hero._id;
    sub_isInArray['hero.synergies.' + synergyIndex + '.deleteVoters'] = userIdentifier;

    var sub_addToSet = {};
    sub_addToSet['hero.synergies.' + synergyIndex + '.deleteVoters'] = userIdentifier;

    var sub_vote = {};
    sub_vote['hero.synergies.' + synergyIndex + '.deleteVotes'] = -1;

    var affected = Heroes.update(
      sub_isInArray,
    {
      $pull: sub_addToSet,
      $inc: sub_vote
    });

    console.log("--- AFFECTED beim UNDO SynergyDeleteVote: " + affected);
    console.log("-- END of synergyDeleteUnvote");
  },

  addSynergy: function(currentUser, hero, synergyName){
    var userIdentifier = currentUser._id;
    var synergyStatus;

    console.log("- START of addSynergy");
    console.log("-- synergyName: " + synergyName);
    console.log("-- userIdentifier: " + userIdentifier);

		if(hero && hero.hero && hero.hero.synergy && hero.hero.synergy.length){
		  // check if synergy-name already exists
		  for(var i=0; i<hero.hero.synergy.length; i++){
		    //console.log("check synergyy..." + hero.hero.synergy[i].name);
		    if(hero.hero.synergy[i].name === synergyName){
		      console.log("-- check synergy... MATCH --> don't add new synergy");
		      console.log("- END of addSynergy");
		      return;
		    }
		  }
		}

    if(isAdmin()){
      synergyStatus = "Approved";
    } else {
      synergyStatus = "Pending";
    }

    var synergyObj = {};
    synergyObj.createdBy = userIdentifier;
    synergyObj.createdAt = new Date();
    synergyObj.name = synergyName;
    synergyObj.status = synergyStatus;
    synergyObj.voters = [];
    synergyObj.votes = 0;
    synergyObj.deleteVoters = [];
    synergyObj.deleteVotes = 0;

    var sub_addToSet = {};
    sub_addToSet['hero.synergies'] = synergyObj;

    var affected = Heroes.update({
      _id: hero._id
    }, {
      $addToSet: sub_addToSet,
    });

    console.log("-- AFFECTED beim addSynergy: " + affected);
    if(affected != 1){
      return "FAILURE. Duplicate?";
    }
    console.log("- END of addSynergy");
    return "SUCCESS";
  },

  upsertHero: function(heroData) {
    console.log("we are in upsertHero. heroData: " + JSON.stringify(heroData));

    var item = Heroes.findOne({"hero.name": heroData.name});
    if(typeof item == 'undefined'){
      console.log("we insert");
       var affected = Heroes.insert({
         hero: heroData
       }, function(error, result){
         if((error && error.invalidKeys) || (error && error.reason)){
           console.log("errrrror: " + JSON.stringify(error.invalidKeys));
         } else {
           console.log("success?");
           console.log("result: " + JSON.stringify(result));
         }
       });
       console.log("affected: " + affected);
    }
    else{
      console.log("we update");
      Heroes.update({
        "hero.name": heroData.name
      },{
        $set: {
          hero: heroData
        }
      },{
        /*upsert: true,
        removeEmptyStrings: false*/
      }, function(error, result){
        if((error && error.invalidKeys) || (error && error.reason)){
          console.log("Error: " + JSON.stringify(error.invalidKeys));
        } else {
          console.log("Success");
          console.log("Result: " + JSON.stringify(result));
        }
      });
      //console.log("simpleSchemaOutput: " + JSON.stringify(Heroes.simpleSchema().namedContext().invalidKeys()));
    }
  },

	upsertLineup: function(lineupData, canBeUpdate) {
		// canBeUpdate=true : if there is an existing Lineup, update it
		// canBeUpdate=false : if there is an existing Lineup, deny insert

    console.log("we are in upsertlineup. lineupData: " + JSON.stringify(lineupData));

    var existingLineup = Lineups.findOne({
			"lineup.levelColor": lineupData.levelColor,
			"lineup.heroes": {
				$all: lineupData.heroes
			}
		});

    if(typeof existingLineup == 'undefined'){
      console.log("insert Lineup");
      var affected = Lineups.insert({
        lineup: lineupData
      }, function(error, result){
        if((error && error.invalidKeys) || (error && error.reason)){
          console.log("errrrror: " + JSON.stringify(error.invalidKeys));
        } else {
          console.log("success?");
          console.log("result: " + JSON.stringify(result));
        }
      });
      console.log("affected: " + affected);
    } else{
			if(canBeUpdate){
				//update
				console.log("update Lineup");
				Lineups.update({
		      _id: existingLineup._id
		    },{
		      $set: {
		        lineup: lineupData
		      }
		    },{
		      /*upsert: true,
		      removeEmptyStrings: false*/
		    }, function(error, result){
		      if((error && error.invalidKeys) || (error && error.reason)){
		        console.log("Error: " + JSON.stringify(error.invalidKeys));
		      } else {
		        console.log("Success");
		        console.log("Result: " + JSON.stringify(result));
		      }
		    });

			} else {
				// deny insert
				console.log("Can't insert because this Lineup already exists!");
			}
		}
	}
});
