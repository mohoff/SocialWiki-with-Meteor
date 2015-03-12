Template.hero.helpers({
  /*normalizedRankingCategory: function(){
    return UI._globalHelpers['getNormalizedRankingCategory']();
  },*/

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

  path_to_avatar: function(){
    var normalizedName = UI._globalHelpers['normalizeString'](this.hero.name);
    //var normalizedName = Meteor.call('normalizeString', this.hero.name);

    //console.log(normalizedName);
    var path = "/img_heroes/" + normalizedName + "/avatar.jpg";
    //console.log("PATHTOAVATAR: " + path);
    return path;
  },

  // LEGACY
  /*scoreCrusade: function(){
    var upvotes = this.hero.ratings.crusade.upvoteCountAlltime;
    var downvotes = this.hero.ratings.crusade.downvoteCountAlltime;
    return upvotes-downvotes;
  },*/

  votedSrc: function(upOrDown){
    var userId = Meteor.userId();
    var voteSource, userIdentifier;
    var voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    if(userId){
      voteSource = 'R';
      userIdentifier = userId;
    } else {
      voteSource = 'Unr';
      userIdentifier = Session.get('clientIp');
    }
    var storedVoters = this.hero.ratings[voteFor][upOrDown + "votersDaily"+voteSource+"egistered"];

    console.log("-UI- Invoked " + upOrDown + "vote from: " + userIdentifier);
    console.log("-UI- stored " + upOrDown + "voters: " + JSON.stringify(storedVoters));

    var hasAlreadyVoted = _.contains(storedVoters, userIdentifier);
    if(hasAlreadyVoted){
      console.log("-UI- userIdentifier has already voted (" + upOrDown + ")");
      if(upOrDown == 'up'){
        return '/voted-up.png';
      } else if (upOrDown == 'down'){
        return '/voted-down.png';
      }
    } else {
      console.log("-UI- userIdentifier has NOT voted, thus voteableGray");
      if(upOrDown == 'up'){
        return '/voteable-up.png';
      } else if (upOrDown == 'down'){
        return '/voteable-down.png';
      }
    }
  }
});

Template.hero.events({
  'click .downvote': function(event){
    event.preventDefault();
    //var voteFor = event.target.getAttribute('data-votefor');
    var voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    var currentUser = Meteor.user(); // does that always return currentUser? Maybe Meteor.user() is better?
    Meteor.call('vote', this, currentUser, voteFor, 'down'); // this = Hero (collection), voteFor = crusade,pve,etc..
  },

  'click .upvote': function(event){
    event.preventDefault();
    console.log("STATUS: " + JSON.stringify(Meteor.status()));
    var voteFor = UI._globalHelpers['getNormalizedRankingCategory']();

    var currentUser = Meteor.user(); // does that always return currentUser? Maybe Meteor.user() is better?
    Meteor.call('vote', this, currentUser, voteFor, 'up', function(err, data) {
      if(err){

      }
      console.log("DATA: " + data);

    });


    // this = Hero (collection), voteFor = crusade,pve,etc..

    /*if(voteType == "up"){ // if upvote was clicked
      if(classes.indexOf("upvotedGreen") > -1){ // if already upvoted
        // try to un-upvote
        Meteor.call('unvote', heroId, voteFor, voteType);
      } else if((classes.indexOf("voteableGray") > -1)){
        // try to upvote
        Meteor.call('vote', heroId, voteFor, voteType);
      }
    } else if(voteType == "down"){
      if(classes.indexOf("downvotedRed") > -1){ // if already downvoted
        // try to un-downvote
      } else if((classes.indexOf("voteableGray") > -1)){
        // try to downvote
      }
    }*/

    //sub_identifierToArray['hero.ratings.'+voteFor+'.'+voteType+'votersDailyRegistered'] = userIdentifier;

    /*var neModifier = { $ne: this.userId };
    var sub_isInArray = {};
    sub_isInArray['_id'] = heroId;
    sub_isInArray['hero.ratings.'+voteFor+'.'+voteType+'votersDailyRegistered'] = neModifier;

    var sub_addToSet = {};
    sub_addToSet['hero.ratings.'+voteFor+'.'+voteType+'votersDailyRegistered'] = this.userId;

    var currentUser = Meteor.users.findOne();
    var votePower = currentUser.currentVoteBonus + currentUser.initialVoteBonus;
    var sub_vote = {};
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountDaily'] = votePower;

    console.log("soweitsogut");

    var affected = Heroes.update(
      sub_isInArray
    , {
      $addToSet: sub_addToSet,
      $inc: sub_vote
    });

    console.log("soweitsogut2");

    console.log("AFFECTED: " + affected);
    if (!affected){
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
    }

*/
    // falls es nicht in sessions schon als "gevoted" markiert ist, mache call:
    // checkIfAlreadyVoted soll auch serverseitig passieren!

    // falls doch:
    // display popup(already voted)

    // mit error function dazu damit user feedback gegeben werden kann ob vote erfolgreich war
    /*Meteor.call('submitData', titleVal, contentVal, function(err){
            if(err){
                //show alert message "error"
                return false;
            }
            else{
                //show alert message "success"
            }
        });*/

    // falls vote-call erfolgreich war, speichere das in sessions


    // event.target references clicked element. can call data/id/class on it
    //console.log("EVENT - heroname(" + heroId + "), voteFor(" + voteFor + "), voteType(" + voteType + ")");
  }
});
