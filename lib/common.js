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
}

userData = function(userId){
  //console.log("USERID: " + userId);
  var result = Meteor.users.find(
  {_id: userId},
  {fields: {
    'lastLoginAt': 1,
    'consecutiveLogins': 1,
    'currentVoteBonus': 1,
    'initalVoteBonus': 1
    }
  });
  //console.log("RESULT: " + result._id);
  return result;
};
