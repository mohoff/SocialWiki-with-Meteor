/*

// Session variables
Session.set('postsLimit', getSetting('postsPerPage', 10));

// Sort postModules array position using modulePositions as index
postModules = _.sortBy(postModules, 'order');
postHeading = _.sortBy(postHeading, 'order');
postMeta = _.sortBy(postMeta, 'order');

*/

var clientIp;

/*Meteor.subscribe("heroes", function() {
  Session.set('loadedHeroes', true);
  console.log("- SUBSCRIBED to heroes");
});*/
Meteor.subscribe("userData", function() {
  Session.set('loadedUserData', true);
  console.log("- SUBSCRIBED to userData");
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.startup(function() {
  if(Meteor.isClient){
    Meteor.call('getIP', function(error, result){
      console.log("clientIp: " + result);
      //clientIp = result;
      Session.set('clientIp', result);
    });
    /*Meteor.autorun(function(){
      if(this.route && this.route.name){
        console.log("ROUTENAME: " + this.route.name);
      }
    });*/
  }
});

// Template.registerHelper creates helpers which can be used by any template
Template.registerHelper("lastLoginAt",function(){
  console.log(" in lastLoginAt function...");
  console.log(" Meteor.user(): " + JSON.stringify(Meteor.user()));
  console.log(" lastLoginAt: " + Meteor.user().userdata.login.lastLoginAt);
  if(Meteor.user() && Meteor.user().userdata.login.lastLoginAt){
    console.log("lastLoginAt exists");
    var lastLoginAt = Meteor.user().userdata.login.lastLoginAt;
    console.log("lastLoginAt: " + lastLoginAt);
    return formatDate(lastLoginAt);
  } else {
    return null;
  }
});

Template.registerHelper("currentVotePower",function(value){
  if(Meteor.user() && Meteor.user().userdata &&
      Meteor.user().userdata.voting && Meteor.user().userdata.voting.currentVotePower){
    return Meteor.user().userdata.voting.currentVotePower;
  } else {
    return 1; // for unregistered users, votePower = 1
  }
});

Template.registerHelper("initialVoteBonus",function(value){
  if(Meteor.user() && Meteor.user().userdata &&
      Meteor.user().userdata.voting && Meteor.user().userdata.voting.initialVoteBonus){
    return Meteor.user().userdata.voting.initialVoteBonus;
  } else {
    return 1; // for unregistered users, votePower = 1
  }
});

Template.registerHelper("loginStreakLength",function(value){
  if(Meteor.user() && Meteor.user().userdata &&
      Meteor.user().userdata.login && Meteor.user().userdata.login.consecutiveLogins){
    return Meteor.user().userdata.login.consecutiveLogins - 1; // -1 so 'today'-login is ignored
  } else {
    return null;
  }
});

Template.heroAdd.events({
  "submit #addheroform": function (event) {

    var str = parseFloat(event.target.growthstatsstr.value);
    var int = parseFloat(event.target.growthstatsint.value);
    var agi = parseFloat(event.target.growthstatsagi.value);

    var type;
    if(str > int && str > agi){
      type = "str";
    } else if(int > str && int > agi){
      type = "int";
    } else {
      type = "agi";
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
          "pvefarming": {
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

/*Meteor.autorun(function () {
  console.log("STATUS: " + JSON.stringify(Meteor.status()));
});*/
