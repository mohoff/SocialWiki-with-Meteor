// can be user from all templates. Use with UI._globalHelpers...

UI.registerHelper("normalizeString", function(input){
  var lowercase = input.toLowerCase();
  var result = lowercase.replace(/ /g, "-");
  console.log("LOWERCASE: " + result);
  return result;
});
