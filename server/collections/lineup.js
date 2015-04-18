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


Schemas.Lineup = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
    //denyUpdate: true    // causes conflict with autoValue
  },
  createdBy: {
    type: String,
    autoValue: function(){
      if (this.isInsert) {
        return this.userId;
      } else if (this.isUpsert) {
        return {$setOnInsert: this.userId};
      } else {
        this.unset();
      }
    }
    //denyUpdate: true    // causes conflict with autoValue
  },
  updatedAt: {
    type: Date,
    autoValue: function(){
      if(this.isUpdate || this.isUpsert){
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
  updatedBy: {
    type: String,
    autoValue: function(){
      if(this.isUpdate || this.isUpsert){
        return this.userId;
      }
    },
    denyInsert: true,
    optional: true
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
  "lineup": {
    type: Object
  },
	"lineup.name": {
    type: String
  },
  "lineup.levelColor": {
    type: String,
		allowedValues: allowedLevelColors
  },
  "lineup.heroes": {
    type: [String],
		minCount: 5,
		maxCount: 5
  },
	"lineup.ratings": {
    type: Object,
    optional: true
  },
  "lineup.ratings.upvoteCountDaily": {
    type: Number,
    optional: true
  },
  "lineup.ratings.upvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "lineup.ratings.upvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "lineup.ratings.upvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  "lineup.ratings.upvotersDailyUnregistered": {
    type: [String],
    optional: true
  },
  "lineup.ratings.downvoteCountDaily": {
    type: Number,
    optional: true
  },
  "lineup.ratings.downvoteCountMonthly": {
    type: Number,
    optional: true
  },
  "lineup.ratings.downvoteCountAlltime": {
    type: Number,
    optional: true
  },
  "lineup.ratings.downvotersDailyRegistered": {
    type: [String],
    optional: true
  },
  "lineup.ratings.downvotersDailyUnregistered": {
    type: [String],
    optional: true
  },

  /* SYNERGIES */
  "lineup.synergies": {
    type: [Object],
    optional: true,
    blackbox: true
  },
  "lineup.synergies.$.createdAt": {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
    denyUpdate: true
  },
  "lineup.synergies.$.createdBy": {
    type: String,
    autoValue: function(){
      if (this.isInsert) {
        return this.userId;
      } else if (this.isUpsert) {
        return {$setOnInsert: this.userId};
      } else {
        this.unset();
      }
    },
    denyUpdate: true
  },
  "lineup.synergies.$.name": {
    type: String
  },
  "lineup.synergies.$.status": {
    type: String,
    autoValue: function(){
      if(_.contains(adminArray, this.userId)){
        return "Approved";
      } else {
        return "Pending Approval";
      }
    }
  },
  "lineup.synergies.$.voters": {
    type: [String],
    optional: true
  },
  "lineup.synergies.$.votes": {
    type: Number,
    optional: true
  },
  "lineup.synergies.$.deleteRequests": {
    type: Number,
    optional: true
  }
});


Lineups.attachSchema(Schemas.Lineup);
