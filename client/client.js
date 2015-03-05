Meteor.subscribe("heroes");
Meteor.subscribe("userData", function() {
  console.log("- SUBSCRIBED to userData");
});

//console.log("userData:" + userData);

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
  initalVoteBonus: function(){
    var data = Meteor.users.findOne();
    return data.initalVoteBonus;
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
          "pve": {
            "upvotes": 0,
            "downvotes": 0
          },
          "arena": {
            "upvotes": 0,
            "downvotes": 0
          },
          "crusade": {
            "upvotes": 0,
            "downvotes": 0
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
