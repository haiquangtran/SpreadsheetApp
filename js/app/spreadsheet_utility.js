// Spreadsheet Utility (Singleton)
var SpreadsheetUtility = new function() {

	this.toLetters = function(number) {
  	var maxLength = 26,	// Alphabet size
    		startChar = 65,		// 'A'
    		letters = ""; 		// 'A-Z', 'AA', 'AB'... etc

    if (number < maxLength) {
      letters = String.fromCharCode(startChar + number);
    } else {
 			// TODO: refactor to make it scalable 
 			letters = String.fromCharCode(startChar + Math.floor(number / maxLength) - 1) + String.fromCharCode(startChar + (number % maxLength));
 		}
 		return letters.toUpperCase();
  };

  this.colToNumber = function(letters) {
  	var maxLength = 26,		// Alphabet size
  		  startChar = 65;		// 'A'
    
    if (letters.length == 2) {
      return parseFloat((letters.charCodeAt(0) - startChar) + (letters.charCodeAt(1) - startChar));
    } else {
      return parseFloat(letters.charCodeAt(0) - startChar);
    }
  };

  this.hasAttr = function(attr) {
    if (typeof attr !== typeof undefined && attr !== false) {
      return true;
    }   
    return false;
  };

  this.isNumber = function(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
  };

  this.getColFromStr = function(str) {
    var letters = str.replace(/[^a-z]/gi, "");
    return letters.toUpperCase();
  };

  this.getRowFromStr = function(str) {
    var digits = str.replace(/\D/g, "");
    return digits;
  };

  this.removeWhiteSpace = function(str) {
    return str.replace(/ /g,'');
  };

  this.isString = function(val) {
    return (typeof val === 'string');
  };

};