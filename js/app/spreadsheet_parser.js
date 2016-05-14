// Spreadsheet Parser Constructor
// Top-Down Parser (LR) 
var SpreadsheetParser = function(spreadsheetEquations) {
	// helper class
	this._spreadsheetEquations = spreadsheetEquations;
};

/*
=================================================================
PUBLIC METHODS
=================================================================
*/	

SpreadsheetParser.prototype.calculateAllEquations = function(spreadsheetTable) {
	var currentInstance = this,
	equationAttr = spreadsheetTable.ATTRS.EQUATION,
	errorMsg = '#VALUE!';

	// Update all equation cells
	$('input[' + equationAttr + ']').each(function() {
		var $current = $(this),
			row = $current.attr(spreadsheetTable.ATTRS.ROW),
			col = $current.attr(spreadsheetTable.ATTRS.COL);
		var equation = SpreadsheetUtility.removeWhiteSpace($current.attr(equationAttr).substring(1));
		var result = currentInstance._calculateEquation($current, spreadsheetTable, currentInstance._spreadsheetEquations.REGEX, equation),
			finalResult = isNaN(result)? errorMsg: result;
		
		// Update
		$current.val(finalResult);
		spreadsheetTable.addData(row, col, finalResult);
	});
};