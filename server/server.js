/*Meteor.startup(function () {
  // code to run on server at startup
  Meteor.onConnection(function(connection) {
    console.log("clientIP: " + connection.clientAddress);
    //Session.set("client_ip", connection.clientAddress);
  });
});*/

Meteor.methods({
  getIP: function(){
    return this.connection.clientAddress;
  },
  addHero: function(input) {
    console.log("we are in addHero.");
    console.log(input);

    Heroes.insert(input);
    console.log('Hero successfully added.');

    // BADGES je nach anzahl mit for-schleif ein json-obj rein
  }
});

Accounts.onLogin(function (user) {
  console.log("- onLogin START");
  var userObj = user.user;
  var userId = userObj._id;
  //console.log("user: " + user.user._id);
  /*var user = Meteor.users.find(
    { _id: userId}
  );*/

  console.log("-- userId: " + userId);
  var lastLoginAt;
  if(userObj.userdata && userObj.userdata.login && userObj.userdata.login.newLoginAt){
    lastLoginAt = userObj.userdata.login.newLoginAt; // newLoginAt becomes lastLoginAt by relogin
  } else {
    lastLoginAt = null;
  }
  console.log("-- BEFORE LOGIN: lastLoginAt: " + lastLoginAt);

  // default values
  var consecutiveLogins = 1;
  var initialVoteBonus = 5;
  // overwrite default values if values present in user object
  if(userObj.userdata && userObj.userdata.login && userObj.userdata.login.consecutiveLogins){
    consecutiveLogins = userObj.userdata.login.consecutiveLogins;
  }
  if(userObj.userdata && userObj.userdata.voting && userObj.userdata.voting.initalVoteBonus){
    initialVoteBonus = userObj.initialVoteBonus;
  }
  var currentVotePower = initialVoteBonus;

  // is it OK to create new dates 3 times? they might be slightly different due to runtime delay
  var currentTimestamp = {};
  currentTimestamp = new Date();
  console.log("-- currentTimestamp: " + currentTimestamp);
  var yesterdayStart = new Date(currentTimestamp);
  var yesterdayEnd = new Date(currentTimestamp);
  yesterdayStart.setDate(currentTimestamp.getDate() - 1);
  yesterdayStart.setHours(0,0,0,0);
  yesterdayEnd.setDate(currentTimestamp.getDate() - 1);
  yesterdayEnd.setHours(23,59,59,999);
  console.log("YesterdayStart: " + yesterdayStart + ", YesterdayEnd: " + yesterdayEnd);
  console.log("-- currentTimestamp: " + currentTimestamp);


  if(lastLoginAt){
    if(currentTimestamp.getDate() == lastLoginAt.getDate()){
      // IS SAME DAY, don't check month and don't check login streak
      console.log("-- isSameDay, don't check month and login streak");
    } else {
      //unsetRatingsFor('Daily');
      if(currentTimestamp.getMonth() != lastLoginAt.getMonth()){
        // IS NEW MONTH, reset all vote boni and login streaks anyway
        //unsetRatingsFor('Monthly');
        console.log("-- isNewMonth");
      } else {
        // IS SAME MONTH
        if((lastLoginAt >= yesterdayStart) && (lastLoginAt <= yesterdayEnd)){
          // IS NEW DAY AND USER EXTENDS LOGIN STREAK
          console.log("-- isInLoginStreak, consecutiveLogins++");
          consecutiveLogins += 1;
        } else {
          consecutiveLogins = 1;
        }
      }
    }
  }
  currentVotePower = initialVoteBonus + consecutiveLogins - 1;

  console.log('-- STORED: initialVoteBonus:' + initialVoteBonus);
  console.log('-- STORED: lastLoginAt:' + lastLoginAt);
  console.log('-- STORED: newLoginAt:' + currentTimestamp);
  console.log('-- STORED: consecutiveLogins:' + consecutiveLogins);
  console.log('-- STORED: currentVotePower:' + currentVotePower);

  // update user record with computed values
  Meteor.users.update(
    { _id: userId},
    {
      /*$currentDate: {
        lastLoginAt: { $type: "date"}
      },*/
      $set: {
        'userdata.login.lastLoginAt': lastLoginAt,  // gets converted to millis internally (so UTC format)
        'userdata.login.newLoginAt': currentTimestamp,  // gets converted to millis internally (so UTC format)
        'userdata.login.consecutiveLogins': consecutiveLogins,
        'userdata.voting.initialVoteBonus': initialVoteBonus,
        'userdata.voting.currentVotePower': currentVotePower
      }
    }
  );
  console.log("- onLogin END");
});
