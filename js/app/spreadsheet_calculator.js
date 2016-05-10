// Spreadsheet Calcuator Constructor 
var SpreadsheetCalculator = function(spreadsheetEquations) {
	// helper class
	this._spreadsheetEquations = spreadsheetEquations;
};

/*
=================================================================
PUBLIC METHODS
=================================================================
*/	

SpreadsheetCalculator.prototype.calculateAllEquations = function(spreadsheetTable) {
	var currentInstance = this,
	equationAttr = spreadsheetTable.ATTRS.EQUATION,
	errorMsg = '#VALUE!';

	// Update all equation cells
	$('input[' + equationAttr + ']').each(function() {
		var $current = $(this),
			row = $current.attr(spreadsheetTable.ATTRS.ROW),
			col = $current.attr(spreadsheetTable.ATTRS.COL);
		var equation = SpreadsheetUtility.removeWhiteSpace($current.attr(equationAttr).substring(1));
		var result = currentInstance._calculateEquation(spreadsheetTable, currentInstance._spreadsheetEquations.REGEX, equation),
			finalResult = isNaN(result)? errorMsg: result;
		
		// Update
		$current.val(finalResult);
		spreadsheetTable.addData(row, col, finalResult);
	});
};

/*
=================================================================
PRIVATE PARSER METHODS
=================================================================
*/	

SpreadsheetCalculator.prototype._calculateEquation = function(spreadsheetTable, regexExpObj, equation) {
	// Cleanse equation before evaluating
	equation = this._parseRangeEquations(spreadsheetTable, regexExpObj, equation);
	equation = this._parseRefCells(spreadsheetTable, regexExpObj, equation);

	// formula contains functions
	if (regexExpObj.functionEquation.test(equation)) {
		return this._parseFunctionEquations(regexExpObj, equation);
	}
	// formula contains only equations
	return this._parseSimpleEquations(regexExpObj, equation);
};

SpreadsheetCalculator.prototype._parseRefCells = function(spreadsheetTable, regexExpObj, equation) {
	// replace all reference cells with values
	var parsedEquation = equation.replace(regexExpObj.refCell, function(match) {
		var row = SpreadsheetUtility.getRowFromStr(match);
		var col = SpreadsheetUtility.getColFromStr(match);
		return spreadsheetTable.getData(row, col);
	});	
	return parsedEquation;
};

SpreadsheetCalculator.prototype._parseFunctionEquations = function(regexExpObj, equation) {
	if (regexExpObj.divEquation.test(equation)) {
		return this._parseFunctionEquation(regexExpObj, regexExpObj.divEquation, equation);
	} else if (regexExpObj.subEquation.test(equation)) {
		return this._parseFunctionEquation(regexExpObj, regexExpObj.subEquation, equation);
	} else if (regexExpObj.multEquation.test(equation)) {
		return this._parseFunctionEquation(regexExpObj, regexExpObj.multEquation, equation);
	} else if (regexExpObj.sumEquation.test(equation)) {
		return this._parseFunctionEquation(regexExpObj, regexExpObj.sumEquation, equation);
	} 
	return '#FUNCTION!';
};

SpreadsheetCalculator.prototype._parseSimpleEquations = function(regexExpObj, equation) {
	while (regexExpObj.simpleEquation.test(equation)) {
		// precedence of operators
		equation = this._parseSimpleDivEquation(regexExpObj, equation);
		equation = this._parseSimpleMultiEquation(regexExpObj, equation);
		equation = this._parseSimpleAddOrSubtractEquation(regexExpObj, equation);
	}
	return equation;	
};

SpreadsheetCalculator.prototype._parseRangeEquations = function(spreadsheetTable, regexExpObj, equation) {
	var currentInstance = this;
	var parsedRange = equation.replace(regexExpObj.rangeEquation, function(match) {
		var valuesRange = match.split(':');
		// range values
		var location1 = valuesRange[0], location2 = valuesRange[1];
		var minLocation = spreadsheetTable.getMinCellLocation(location1, location2), 
			maxLocation = spreadsheetTable.getMaxCellLocation(location1, location2);
 		return currentInstance._spreadsheetEquations.getValuesBetweenRange(spreadsheetTable, minLocation, maxLocation).toString();
	});
	return parsedRange;
};

SpreadsheetCalculator.prototype._parseSimpleDivEquation = function(regexExpObj, equation) {
	return this._parseSimpleEquation(regexExpObj, regexExpObj.simpleDivEquation, equation);
};

SpreadsheetCalculator.prototype._parseSimpleMultiEquation = function(regexExpObj, equation) {
	return this._parseSimpleEquation(regexExpObj, regexExpObj.simpleMultiEquation, equation);
};

SpreadsheetCalculator.prototype._parseSimpleAddOrSubtractEquation = function(regexExpObj, equation) {
	return this._parseSimpleEquation(regexExpObj, regexExpObj.simpleAddOrSubtractEquation, equation);
};

SpreadsheetCalculator.prototype._parseFunctionEquation = function(regexExpObj, regexExp, equation) {
	var parsedFunction = equation.replace(regexExp, '').replace(regexExpObj.closingBracket, '');

	// Execute simple equations inside function formula
	parsedFunction = this._parseSimpleEquations(regexExpObj, parsedFunction);
	var valuesArray = parsedFunction.split(',');

	return this._spreadsheetEquations.executeFunctionEquation(regexExp, valuesArray);
};

SpreadsheetCalculator.prototype._parseSimpleEquation = function(regexExpObj, regexExp, equation) {
	var currentInstance = this;
	var parsedEquation = equation.replace(regexExp, function(match) {
		var expression = match.split(regexExpObj.operator);
		var num1 = expression[0],
			operator = expression[1],
			num2 = expression[2];
		return currentInstance._spreadsheetEquations.executeSimpleEquation(operator, parseFloat(num1), parseFloat(num2));
	});
	return parsedEquation;
};