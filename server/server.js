Meteor.startup(function () {
  // code to run on server at startup
});

Meteor.publish("heroes", function() {
  return Heroes.find();
});
Meteor.publish("userData", function() {
  return userData(this.userId);
});

Meteor.methods({
  addHero: function (input) {
    console.log("we are in addHero.");
    console.log(input);

    Heroes.insert(input);
    console.log('Hero successfully added.');

    // BADGES je nach anzahl mit for-schleif ein json-obj rein
  }
});

Accounts.onLogin(function (user) {
  console.log("- onLogin START");
  var userId = user.user._id;
  //console.log("user: " + user.user._id);
  /*var user = Meteor.users.find(
    { _id: userId}
  );*/

  console.log("-- userId: " + userId);
  var lastLoginAt = user.user.lastLoginAt;
  console.log("-- BEFORE LOGIN: lastLoginAt: " + lastLoginAt);

  // is it OK to create new dates 3 times? they might be slightly different due to runtime delay
  var currentTimestamp = new Date();
  console.log("-- currentTimestamp: " + currentTimestamp);
  var yesterdayStart = new Date();
  var yesterdayEnd = new Date();
  yesterdayStart.setDate(currentTimestamp.getDate() - 1);
  yesterdayStart.setHours(0,0,0,0);
  yesterdayEnd.setDate(currentTimestamp.getDate() - 1);
  yesterdayEnd.setHours(23,59,59,999);

  var isInLoginStreak = false;
  var isNewMonth = false;

  if(!lastLoginAt){
    isInLoginStreak = false;
    isNewMonth = false;
  } else {
    isInLoginStreak = false;
    isNewMonth = false;

    if(currentTimestamp >= yesterdayStart && currentTimestamp <= yesterdayEnd){
      isInLoginStreak = true;
      console.log("-- isInLoginStreak");
    }
    if(currentTimestamp.getMonth() != lastLoginAt.getMonth()){
      isNewMonth = true;
      console.log("-- isNewMonth");
    }
  }



  // default values
  var consecutiveLogins = 1;
  var currentVoteBonus = 0;
  var initalVoteBonus = 5;
  var loginStreak = 0;

  // overwrite default values if values present in user object
  if(user.consecutiveLogins){
    consecutiveLogins = user.consecutiveLogins;
  }
  /*if(user.currentVoteBonus){
    currentVoteBonus = user.currentVoteBonus;
  }*/
  if(user.loginStreak){
    loginStreak = user.loginStreak;
  }
  if(user.initalVoteBonus){
    initalVoteBonus = user.initalVoteBonus;
  }

  // isNewMonth and isInLoginStreak verification
  if(isNewMonth){
    // reset loginstreak
    // reset loginstreakbonus points
    //consecutiveLogins = 1;
    //currentVoteBonus = 0;
  } else if(isInLoginStreak){
    currentVoteBonus = initalVoteBonus + consecutiveLogins - 1;
  } else {
    // set loginstreakbonus points = 0
    //currentVoteBonus = 0;
    //consecutiveLogins = 0;
  }

  console.log('-- STORED: initalVoteBonus:' + initalVoteBonus);
  console.log('-- STORED: lastLoginAt:' + currentTimestamp);
  console.log('-- STORED: consecutiveLogins:' + consecutiveLogins);
  console.log('-- STORED: currentVoteBonus:' + currentVoteBonus);

  // update user record with computed values
  Meteor.users.update(
    { _id: userId},
    {
      /*$currentDate: {
        lastLoginAt: { $type: "date"}
      },*/
      $set: {
        'initalVoteBonus': initalVoteBonus,
        'lastLoginAt': currentTimestamp,  // gets converted to millis internally (so UTC format)
        'consecutiveLogins': consecutiveLogins,
        'currentVoteBonus': currentVoteBonus
      }
    }
  );
  console.log("- onLogin END");
});
