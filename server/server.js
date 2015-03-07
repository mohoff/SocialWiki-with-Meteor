Meteor.startup(function () {
  // code to run on server at startup
  Meteor.onConnection(function(connection) {
    console.log("clientIP: " + connection.clientAddress);
    //Session.set("client_ip", connection.clientAddress);
  });
});

Meteor.publish("heroes", function() {
  return Heroes.find();
});
Meteor.publish("userData", function() {
  return userData(this.userId);
});

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
  },

  voteOLD: function(heroid, voteFor, voteType){
    var votePower;
    var userIdentifier;

    var sub_vote = {};
    var sub_identifierToArray = {};

    // check if user hasn't voted already
    //      throw new Meteor.Error("logged-out",
    //        "The user must be logged in to post a comment.");
    //



    if(Meteor.user()){
      var voteBasePoints = Meteor.user().initialVoteBonus;
      var voteStackingPoints = Meteor.user().currentVoteBonus;
      votePower = voteBasePoints + voteStackingPoints;
      userIdentifier = Meteor.user()._id;


      sub_identifierToArray['hero.ratings.'+voteFor+'.'+voteType+'votersDailyRegistered'] = userIdentifier;

    } else {
      votePower = 1;
      userIdentifier = this.connection.clientAddress;
      sub_identifierToArray['hero.ratings.'+voteFor+'.'+voteType+'votersDailyUnregistered'] = userIdentifier;
    }

    //var col = db.collection('heroes');
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
    var col = db.collection("heroes");
    var batch = col.initializeOrderedBulkOp();
    batch.find({_id: heroid}).upsert().updateOne({"$addToSet": sub_identifierToArray});
    // Execute the operations
    batch.execute(function(err, result) {
      if (err) throw err;
      console.log("nUpserted: ", result.nUpserted);
      console.log("nInserted: ", result.nInserted);
      console.log("nModified: ", result.nModified); // <- will tell if a value was added or not
      console.log("RESULT: ", JSON.stringify(result));
      //db.close();
    });
    console.log("END OF BATCH!");

    /*
    var updateResult = Heroes.update(
      { _id: heroid},
      {
        $addToSet:
          sub_identifierToArray
      },
      function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
        } else {
          console.log('updating successful: ' + err + ' result: ' + result);
        }
      }
    );*/
    //console.log("UPDATERESULT-nModified: " + updateResult.nModified);


    console.log("- VOTE: heroname(" + heroid + "), voteFor(" + voteFor + "), voteType(" + voteType + ")");
    console.log("-- by user: " + userIdentifier);
    console.log("-- with votepower: " + votePower);

    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountDaily'] = votePower;

    Heroes.update(
      { _id: heroid},
      {
        $inc:
          sub_vote
        /*$addToSet:
          sub_identifierToArray*/
      }
    );

  },
  unvoteOLD: function(heroid, voteFor, voteType){
    var votePower;
    var userIdentifier;

    var sub_vote = {};
    var sub_identifierToArray = {};

    // check if user hasn't voted already
    //      throw new Meteor.Error("logged-out",
    //        "The user must be logged in to post a comment.");
    //



    if(Meteor.user()){
      var voteBasePoints = Meteor.user().initialVoteBonus;
      var voteStackingPoints = Meteor.user().currentVoteBonus;
      votePower = voteBasePoints + voteStackingPoints;
      userIdentifier = Meteor.user()._id;


      sub_identifierToArray['hero.ratings.'+voteFor+'.'+voteType+'votersDailyRegistered'] = userIdentifier;

    } else {
      votePower = 1;
      userIdentifier = this.connection.clientAddress;
      sub_identifierToArray['hero.ratings.'+voteFor+'.'+voteType+'votersDailyUnregistered'] = userIdentifier;
    }
    votePower = -votePower; // that votePower gets applied as decrement

    console.log("- UNVOTE: heroname(" + heroid + "), voteFor(" + voteFor + "), voteType(" + voteType + ")");
    console.log("-- by user: " + userIdentifier);
    console.log("-- with votepower: " + votePower);

    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountAlltime'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountMonthly'] = votePower;
    sub_vote['hero.ratings.'+voteFor+'.'+voteType+'voteCountDaily'] = votePower;

    Heroes.update(
      { _id: heroid},
      {
        $inc:
          sub_vote,
        $pull:
          sub_identifierToArray
      }
    );

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
  var initialVoteBonus = 5;
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
    initialVoteBonus = user.initialVoteBonus;
  }

  // isNewMonth and isInLoginStreak verification
  if(isNewMonth){
    // reset loginstreak
    // reset loginstreakbonus points
    //consecutiveLogins = 1;
    //currentVoteBonus = 0;
  } else if(isInLoginStreak){
    currentVoteBonus = initialVoteBonus + consecutiveLogins - 1;
  } else {
    // set loginstreakbonus points = 0
    //currentVoteBonus = 0;
    //consecutiveLogins = 0;
  }

  console.log('-- STORED: initialVoteBonus:' + initialVoteBonus);
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
        'initialVoteBonus': initialVoteBonus,
        'lastLoginAt': currentTimestamp,  // gets converted to millis internally (so UTC format)
        'consecutiveLogins': consecutiveLogins,
        'currentVoteBonus': currentVoteBonus
      }
    }
  );
  console.log("- onLogin END");
});
