Heroes = new Mongo.Collection("heroes");

convertDateToUTC = function(date) {
  return new Date(date.getUTCFullYear(),
                  date.getUTCMonth(),
                  date.getUTCDate(),
                  date.getUTCHours(),
                  date.getUTCMinutes(),
                  date.getUTCSeconds()
  );
}
