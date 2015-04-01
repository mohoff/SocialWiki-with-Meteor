var Schemas = {};

// default: all specified fields/arrays/etc are mandatory!

/* VALUES
  // type: String, Date, Number, Boolean, [Object] (also for arrays)
          // to indicate that array of values of that type is expected:
          [String], [Number], [Boolean], [Object], [Date]
  // label: "Title"
  // max: 200
  // min: 0
  // optional: true
  // defaultValue (set if field is empty or undefined)
  // regEx: /^[A-Z]{2}$/
  // allowedValues: ['bla', 'blup']
  // blackbox: true (used, if you want to skip validation for nested attributes). used for type = [Object]
  // denyUpdate: true, false
  // denyInsert: true, false (if used, you need to set optional=true)
  // autoValue: function()...if insert/update/upsert ... return new Date()
  // index: 1, true, -1 (ensure a MongoDB index for that field) (-1 = DESC)
  // minCount: 1 // only for arrays
  // maxCount: 4 // only for arrays
  // decimal: true, false (default: false). specify if type is Number or [Number] and you want to allow non-integers (floats?)


*/
var adminArray = [''];
var allowedTypes = ['STR', 'INT', 'AGI'];

Schemas.Hero = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function(){
      if(this.isInsert){
        return new Date();
      }
    }
  },
  createdBy: {
    type: String,
    autoValue: function(){
      if(this.isInsert){
        return this.userId;
      }
    }
  },
  updatedAt: {
    type: Date,
    defaultValue: new Date()
  },
  updatedBy: {
    type: String,
    defaultValue: this.userId
  },
  status: {
    type: String,
    autoValue: function(){
      if(_.contains(adminArray, this.userId)){
        return "Approved";
      } else {
        return "Pending Approval";
      }
    }
  },
  "hero": {
    type: Object
  },
  "hero.name": {
    type: String
  },
  "hero.surname": {
    type: String
  },
  "hero.type": {
    type: String,
    allowedValues: allowedTypes
  },
  "hero.growthstats": {
    type: Object,
    optional: true
  },
  "hero.growthstats.str": {
    type: Number,
    decimal: true,
    optional: true
  },
  "hero.growthstats.int": {
    type: Number,
    decimal: true,
    optional: true
  },
  "hero.growthstats.agi": {
    type: Number,
    decimal: true,
    optional: true
  },
  "hero.badges": {
    type: [String],
    optional: true
  },
  /*"hero.badges.$": {       // or how else define array-element?
    type: Object,
  },*/
  "hero.attributes": {       // or how else define array-element?
    type: [String],
    optional: true
  },
  /*"hero.attributes.$": {       // or how else define array-element?

  },*/
  "hero.lineupOrder": {
    type: [Number],
    optional: true
  },

  /* ---- SKILLS ---- */

  "hero.skills": {
    type: [Object]
  },
  /*"hero.skills.$": {
    // object
  },*/
  "hero.skills.$.order": {
    type: Number,
    min: 1,
    max: 5
  },
  "hero.skills.$.name": {
    type: String,
  },
  "hero.skills.$.desc": {
    type: String,
    optional: true
  },
  "hero.skills.$.types": {
    type: [String],
    optional: true
  },
  /*"hero.skills.$.types.$": {
    // string
  },*/
  "hero.skills.$.stats": {
    type: [Object]
  },
  /*"hero.skills.$.stats.$": {
    // object
  },*/
  "hero.skills.$.stats.$.type": {
    type: String
  },
  "hero.skills.$.stats.$.lvl1": {
    type: String
  },
  "hero.skills.$.stats.$.perLvl": {
    type: String
  },
  "hero.ratings": {
    type: Object,
    optional: true
  },

  /* ---- ARENA ---- */

  "hero.ratings.arena": {
    type: Object,
    optional: true
  },
  "hero.ratings.arena.upvoteCountDaily": {
    type: Number,
    optional: true
  },
  "hero.ratings.arena.upvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "hero.ratings.arena.upvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "hero.ratings.arena.upvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.upvotersDailyRegistered.$": {
    // userId
  },*/
  "hero.ratings.arena.upvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.upvotersDailyUnregistered.$": {
    // string
  },*/
  "hero.ratings.arena.downvoteCountDaily": {
    type: Number,
    optional: true
  },
  "hero.ratings.arena.downvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "hero.ratings.arena.downvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "hero.ratings.arena.downvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.downvotersDailyRegistered.$": {
    // userId
  },*/
  "hero.ratings.arena.downvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.downvotersDailyUnregistered.$": {
    // string
  },*/

  /* ---- CRUSADE ---- */

  "hero.ratings.crusade": {
    type: Object,
    optional: true
  },
  "hero.ratings.crusade.upvoteCountDaily": {
    type: Number,
    optional: true
  },
  "hero.ratings.crusade.upvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "hero.ratings.crusade.upvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "hero.ratings.crusade.upvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.upvotersDailyRegistered.$": {
    // userId
  },*/
  "hero.ratings.crusade.upvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.upvotersDailyUnregistered.$": {
    // string
  },*/
  "hero.ratings.crusade.downvoteCountDaily": {
    type: Number,
    optional: true
  },
  "hero.ratings.crusade.downvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "hero.ratings.crusade.downvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "hero.ratings.crusade.downvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.downvotersDailyRegistered.$": {
    // userId
  },*/
  "hero.ratings.crusade.downvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.downvotersDailyUnregistered.$": {
    // string
  },*/

  /* ---- PVEFARMING ---- */

  "hero.ratings.pvefarming": {
    type: Object,
    optional: true
  },
  "hero.ratings.pvefarming.upvoteCountDaily": {
    type: Number,
    optional: true
  },
  "hero.ratings.pvefarming.upvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "hero.ratings.pvefarming.upvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "hero.ratings.pvefarming.upvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.upvotersDailyRegistered.$": {
    // userId
  },*/
  "hero.ratings.pvefarming.upvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.upvotersDailyUnregistered.$": {
    // string
  },*/
  "hero.ratings.pvefarming.downvoteCountDaily": {
    type: Number,
    optional: true
  },
  "hero.ratings.pvefarming.downvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "hero.ratings.pvefarming.downvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "hero.ratings.pvefarming.downvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.downvotersDailyRegistered.$": {
    // userId
  },*/
  "hero.ratings.pvefarming.downvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  /*"hero.ratings.arena.downvotersDailyUnregistered.$": {
    // string
  },*/

  /* SYNERGIES */

  "hero.synergies": {
    type: [Object],
    optional: true
  },
  "hero.synergies.$.createdAt": {
    type: Date,
    autoValue: function(){
      if(this.isInsert){
        return new Date();
      }
    }
  },
  "hero.synergies.$.createdBy": {
    type: String,
    autoValue: function(){
      if(this.isInsert){
        return this.userId;
      }
    }
  },
  "hero.synergies.$.name": {
    type: String
  },
  "hero.synergies.$.status": {
    type: String,
    autoValue: function(){
      if(_.contains(adminArray, this.userId)){
        return "Approved";
      } else {
        return "Pending Approval";
      }
    }
  },
  "hero.synergies.$.voters": {
    type: [String],
    optional: true
  },
  /*"hero.synergies.$.voters.$": {
    // userIds
  },*/
  "hero.synergies.$.votes": {
    type: Number,
    optional: true
  },
  "hero.synergies.$.deleteRequests": {
    type: Number,
    optional: true
  }
});
