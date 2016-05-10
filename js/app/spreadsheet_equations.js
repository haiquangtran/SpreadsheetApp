// Spreadsheet Equations Constructor 
// Helper class for Spreadsheet Parser
var SpreadsheetEquations = function() {

};

// Helper equation regexes for Spreadsheet Calculator
SpreadsheetEquations.prototype.REGEX = {
	// matches only cell reference locations where col: A to ZZ and row:1 to 100.
	// i.e. A1, A100, ZZ100 
	refCell: /\b[A-Z]{1,2}([1-9][0-9]?|100)\b/gi, 
	// matches on a number followed by an operator (*,/,+,-) followed by number  
	// i.e. 1+1, 0.5+0.2, 1-1, 10/5, 1 * 1 etc...								
	simpleEquation: /([0-9]\d*(\.\d+)?)(\/|\*|\+|\-)([0-9]\d*(\.\d+)?)/,
	// matches on a division equation (x/y) where x and y are numbers
	// i.e 1/2, 5.5/2, 2.5/0.1 etc... 
	simpleDivEquation: /([0-9]\d*(\.\d+)?)\/([0-9]\d*(\.\d+)?)/g,
	// matches on multiplication equation (x*y) where x and y are numbers
	// i.e 5*0.5, 5*2, 0.5*0.5 etc...  		
	simpleMultiEquation: /([0-9]\d*(\.\d+)?)\*([0-9]\d*(\.\d+)?)/g, 	
	// matches on an add or subtract equation (x-y or x+y) where x and y are numbers
	// i.e 5.0+2.5, 5+2, 10-2, 5-2, 10.5-0.5 etc... 	
	simpleAddOrSubtractEquation: /([0-9]\d*(\.\d+)?)(\+|\-)([0-9]\d*(\.\d+)?)/g, 
	// matches on the format where everything in square brackets is optional: 
	// function(x [,x | ,x operator y]) where function = SUM|DIV|SUB|MULT, x = number, 
	// i.e. SUM(1), SUM(1, 2, 3), SUM(0.5, 5), SUM(5+5+5, 10) etc...
	// TODO: allow regex to take in nested functions i.e. SUM(SUM(1,23),3)
	// TODO: Brackets
	functionEquation: /^(SUM|DIV|SUB|MULT)\(([0-9]\d*(\.\d+)?)((\,|\+|\-|\*|\/)([0-9]\d*(\.\d+)?))*\)$/i,	
	// matches on DIV(
	divEquation: /(^DIV\()/gi,
	// matches on MULT(
	multEquation: /(^MULT\()/gi,
	// matches on SUB(
	subEquation: /(^SUB\()/gi,
	// matches on SUM(
	sumEquation: /(^SUM\()/gi,
	// matches on a range in the format: cellRef:cellRef where a cellRef range is col: A to ZZ and row:1 to 100.
	rangeEquation: /\b[A-Z]{1,2}([1-9][0-9]?|100):[A-Z]{1,2}([1-9][0-9]?|100)\b/gi,
	// matches on the operators: /, *, +, -
	operator: /(\/|\*|\+|\-)/,
	// matches on )
	closingBracket: /\)/g
};

/*
=================================================================
PUBLIC METHODS
=================================================================
*/	

SpreadsheetEquations.prototype.executeFunctionEquation = function(regexExp, valuesArray) {
	switch (regexExp) {
		case this.REGEX.sumEquation:
			return this._executeOperatorOnValues('+', valuesArray);
		case this.REGEX.divEquation:
			return this._executeOperatorOnValues('/', valuesArray);
		case this.REGEX.subEquation:
			return this._executeOperatorOnValues('-', valuesArray);
		case this.REGEX.multEquation:
			return this._executeOperatorOnValues('*', valuesArray);
		default:
			return '#FUNCTION!';
	}
};

SpreadsheetEquations.prototype.executeSimpleEquation = function(operator, x, y) {
	switch (operator) {
		case '/':
			return this._divide(x, y);
		case '*':
			return this._multiply(x, y);
		case '+':
			return this._add(x, y);
		case '-':
			return this._subtract(x, y);
		default:
			return '#EQUATION!'; 
	}
};

SpreadsheetEquations.prototype.getValuesBetweenRange = function(spreadsheetTable, minLocation, maxLocation) {
	var minRow = SpreadsheetUtility.getRowFromStr(minLocation), 
		maxRow = SpreadsheetUtility.getRowFromStr(maxLocation), 
		minCol = SpreadsheetUtility.colToNumber(SpreadsheetUtility.getColFromStr(minLocation)),
		maxCol = SpreadsheetUtility.colToNumber(SpreadsheetUtility.getColFromStr(maxLocation));
	var valuesArray = [];
	for (var row = minRow; row <= maxRow; row++) {
		for (var col = minCol; col <= maxCol; col++) {
			var colLetter = SpreadsheetUtility.toLetters(col);
			valuesArray.push(spreadsheetTable.getData(row, colLetter));
		}
	}
	return valuesArray;
};

/*
=================================================================
PRIVATE METHODS
=================================================================
*/	

SpreadsheetEquations.prototype._executeOperatorOnValues = function(operation, valuesArray) {
	var result = parseFloat(valuesArray[0]);
	for (var i = 1; i < valuesArray.length; i++) {
		result = this.executeSimpleEquation(operation, result, parseFloat(valuesArray[i]));
	}
	return parseFloat(result);
};

SpreadsheetEquations.prototype._add = function(x, y) { 
	return parseFloat(x + y); 
};

SpreadsheetEquations.prototype._subtract = function(x, y) { 
	return parseFloat(x - y); 
};

SpreadsheetEquations.prototype._multiply = function(x, y) { 
	return parseFloat(x * y); 
};

SpreadsheetEquations.prototype._divide = function(x, y) { 
	if (y === 0 || x === 0) {
		console.log('#DIV/0!');
		return '#DIV/0!';
	}
	return parseFloat(x / y); 
};