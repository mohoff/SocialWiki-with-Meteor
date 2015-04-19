Meteor.publish("heroes", function() {
  return Heroes.find();
});
Meteor.publish("lineups", function() {
  return Lineups.find();
});
Meteor.publish("userData", function() {
  if(!this.userId){
    return null;
  } else {
    return userData(this.userId);
  }
});
