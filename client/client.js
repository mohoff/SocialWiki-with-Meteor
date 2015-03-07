Meteor.subscribe("heroes");
Meteor.subscribe("userData", function() {
  console.log("- SUBSCRIBED to userData");
});
var clientIp;
//console.log("userData:" + userData);

Meteor.startup(function(){
  Meteor.call('getIP', function(error, result){
    console.log("clientIP: " + result);
    clientIp = result;
  })
})


// can be user from all templates. Use with UI._globalHelpers...
Template.registerHelper("normalizeString", function(input){
  var lowercase = input.toLowerCase();
  var result = lowercase.replace(/ /g, "-");
  console.log("LOWERCASE: " + result);
  return result;
});

Template.body.helpers({
  heroes: function() {
    return Heroes.find();
      //{}, {sort: {createdAt: -1}});
  },
  lastLoginAt: function(){
    var data = Meteor.users.findOne();
    var date = data.lastLoginAt;
    //console.log(dateString);
    return formatDate(date);
  },
  initialVoteBonus: function(){
    var data = Meteor.users.findOne();
    return data.initialVoteBonus;
  },
  consecutiveLogins: function(){
    var data = Meteor.users.findOne();
    return data.consecutiveLogins;
  },
  currentVoteBonus: function(){
    var data = Meteor.users.findOne();
    return data.currentVoteBonus;
  }

});

Template.userData.helpers({
  /*lastLoginAt: function(){
    console.log("lastLoginAt: " + JSON.stringify( Meteor.users.findOne()));
    return lastLoginAt;
  }*/
});

// WORKS but not sure if this UI._globalHelpers syntax is the way to go
// apparently it is the way to go in order to get all our stuff done at clientside
Template.hero.helpers({
  //name: this.hero.name,
  path_to_avatar: function(){
    var normalizedName = UI._globalHelpers['normalizeString'](this.hero.name);
    //var normalizedName = Meteor.call('normalizeString', this.hero.name);

    //console.log(normalizedName);
    var path = "/img_heroes/" + normalizedName + "/avatar.jpg";
    //console.log("PATHTOAVATAR: " + path);
    return path;
  },

  scoreCrusade: function(){
    var upvotes = this.hero.ratings.crusade.upvoteCountAlltime;
    var downvotes = this.hero.ratings.crusade.downvoteCountAlltime;
    return upvotes-downvotes;
  },

  votedClass: function(upOrDown, voteFor){
    var userId = Meteor.userId();
    var voteSource, userIdentifier;

    if(userId){
      voteSource = 'R';
      userIdentifier = userId;
    } else {
      voteSource = 'Unr';
      userIdentifier = clientIp;
    }
    var storedVoters = this.hero.ratings[voteFor][upOrDown + "votersDaily"+voteSource+"egistered"]

    console.log("-UI- Invoked " + upOrDown + "vote from: " + userIdentifier);
    console.log("-UI- stored " + upOrDown + "voters: " + JSON.stringify(storedVoters));

    var hasAlreadyVoted = _.contains(storedVoters, userIdentifier);
    if(hasAlreadyVoted){
      if(upOrDown == 'up'){
        return 'upvotedGreen';
      } else if (upOrDown == 'down'){
        return 'downvotedRed';
      }
      console.log("-UI- userIdentifier has already voted (" + upOrDown + ")");
    } else {
      console.log("-UI- userIdentifier has NOT voted, thus voteableGray");
      return 'voteableGray';
    }
  }
});

Template.hero.events({
  'click .downvote': function(event){
    event.preventDefault();
    var voteFor = event.target.getAttribute('data-votefor');

    var currentUser = Meteor.user(); // does that always return currentUser? Maybe Meteor.user() is better?
    Meteor.call('vote', this, currentUser, voteFor, 'down'); // this = Hero (collection), voteFor = crusade,pve,etc..
  },

  'click .upvote': function(event){
    event.preventDefault();
    var voteFor = event.target.getAttribute('data-votefor');

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

Template.body.events({
  "submit #addheroform": function (event) {

    var str = parseFloat(event.target.growthstatsstr.value);
    var int = parseFloat(event.target.growthstatsint.value);
    var agi = parseFloat(event.target.growthstatsagi.value);

    var type;
    if(str > int && str > agi){
      type = "STR";
    } else if(int > str && int > agi){
      type = "INT";
    } else {
      type = "AGI";
    }

    var currentTime = new Date();
    var userId = Meteor.userId();

    var data = {
      "createdAt": currentTime,
      "createdFrom": userId,
      "updatedAt": currentTime,
      "updatedFrom": userId,
      "hero": {
        "name": event.target.name.value,
        "surname": event.target.surname.value,
        "type": type,
        "growthstats": {
          "agi": agi,
          "int": int,
          "str": str
        },
        "badges": [
          event.target.badge1.value
        ],
        "lineuporder": event.target.lineuporder.value,
        "skills": [
          {
            "order": 1,
            "name": event.target.skill1name.value,
            "desc": event.target.skill1desc.value,
            "lvl1": {
              "damage": event.target.skill1initialdmg1.value
            },
            "perlvl": {
              "damage": event.target.skill1perlvlgrowth1.value
            }
          }
        ],
        "ratings": {
          "forDay": new Date(),
          "pve": {
            "upvoteCountAlltime": 0,
            "upvoteCountMonthly": 0,
            "upvoteCountDaily": 0,
            "upvotersDailyUnregistered": [],
            "upvotersDailyRegistered": [],
            "downvoteCountAlltime": 0,
            "downvoteCountMonthly": 0,
            "downvoteCountDaily": 0,
            "downvotersDailyUnregistered": [],
            "downvotersDailyRegistered": []
          },
          "arena": {
            "upvoteCountAlltime": 0,
            "upvoteCountMonthly": 0,
            "upvoteCountDaily": 0,
            "upvotersDailyUnregistered": [],
            "upvotersDailyRegistered": [],
            "downvoteCountAlltime": 0,
            "downvoteCountMonthly": 0,
            "downvoteCountDaily": 0,
            "downvotersDailyUnregistered": [],
            "downvotersDailyRegistered": []
          },
          "crusade": {
            "upvoteCountAlltime": 0,
            "upvoteCountMonthly": 0,
            "upvoteCountDaily": 0,
            "upvotersDailyUnregistered": [],
            "upvotersDailyRegistered": [],
            "downvoteCountAlltime": 0,
            "downvoteCountMonthly": 0,
            "downvoteCountDaily": 0,
            "downvotersDailyUnregistered": [],
            "downvotersDailyRegistered": []
          }
        },
        "synergy": [
          {
            "name": event.target.synergy1.value,
            "upvotes": 0,
            "downvotes": 0
          }
        ]
      }
    };

    Meteor.call("addHero", data);

    // clear form
    //event.target.text.value = "";

    // prevent default form submit

    event.preventDefault();
    return false;
  }
});

/*Template.body.events({
  "submit": function (event) {
    //var text = event.target;
    console.log(event);


    Meteor.call("addHero", text);

    // clear form
    //event.target.text.value = "";
    event.preventDefault();
    // prevent default form submit
    //return false;
  },
});*/

// counter starts at 0
/*Session.setDefault('counter', 0);

Template.hello.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});*/

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
