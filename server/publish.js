Meteor.publish("heroes", function() {
  return Heroes.find();
});
Meteor.publish("userData", function() {
  if(!this.userId){
    return null;
  } else {
    return userData(this.userId);
  }
});
