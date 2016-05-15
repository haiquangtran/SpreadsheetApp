define(['app/spreadsheet_utility'], function(SpreadsheetUtility) {

	// Spreadsheet Table
	function SpreadsheetTable() {
		// 2D array representing the spreadsheet cells.
		this._dataTable = [];
	};

	SpreadsheetTable.prototype.ATTRS = {
		ROW: 'data-row',
		COL: 'data-col',
		EQUATION: 'data-equation'
	};

	/*
	=================================================================
	PUBLIC METHODS
	=================================================================
	*/	

	SpreadsheetTable.prototype.createTable = function(tableElement, rowSize, colSize) {
		this._initialiseDataMap(rowSize, colSize);
		this._createTableHTMLElements(tableElement, rowSize, colSize);
	};

	SpreadsheetTable.prototype.getDataTable = function() {
		return this._dataTable;
	};

	SpreadsheetTable.prototype.storeCellData = function($currentCell) {
	    var cellValue = $currentCell.val(),
	        row = $currentCell.attr(this.ATTRS.ROW),
	        col = $currentCell.attr(this.ATTRS.COL);

	    if (SpreadsheetUtility.isString(cellValue) && this._isEquationCell($currentCell)) {
	        // Store equations
	        this._storeEquationOnElement($currentCell);
	    } else {
	    	// Remove equation if it exists
	    	this._removeEquationOnElement($currentCell);
	    	// Store data
	    	if (cellValue) {
	    		this.addData(row, col, parseFloat(cellValue)); 		
	    	}
	    }
	};

	SpreadsheetTable.prototype.getData = function(row, col) {
		return this._dataTable[row][col.toUpperCase()];
	};

	SpreadsheetTable.prototype.addData = function(row, col, cellValue) {
		this._dataTable[row][col.toUpperCase()] =  cellValue;
	};

	SpreadsheetTable.prototype.getMinCellLocation = function(cellLocation1, cellLocation2) {
		var row1 = SpreadsheetUtility.getRowFromStr(cellLocation1), 
			col1 = SpreadsheetUtility.getColFromStr(cellLocation1),
			row2 = SpreadsheetUtility.getRowFromStr(cellLocation2), 
			col2 = SpreadsheetUtility.getColFromStr(cellLocation2);

		if (row1 <= row2 && SpreadsheetUtility.colToNumber(col1) < SpreadsheetUtility.colToNumber(col2)
			|| row1 < row2 && SpreadsheetUtility.colToNumber(col1) === SpreadsheetUtility.colToNumber(col2)) {
			return cellLocation1;
		} else {
			return cellLocation2;
		}
	};

	SpreadsheetTable.prototype.getMaxCellLocation = function(cellLocation1, cellLocation2) {
		return (this.getMinCellLocation(cellLocation1, cellLocation2) === cellLocation1? cellLocation2: cellLocation1);
	};

	/*
	=================================================================
	PRIVATE METHODS
	=================================================================
	*/	

	SpreadsheetTable.prototype._initialiseDataMap = function(rowSize, colSize) {
		for (var i = 0; i < rowSize + 1; i++) {
			this._dataTable[i] = [];
			for (var j = 0; j < colSize + 1; j++) {
				var colTitle = SpreadsheetUtility.toLetters(j);
				this._dataTable[i][colTitle] = 0;
			}
		}
	};

	SpreadsheetTable.prototype._createTableHTMLElements = function(tableElement, rowSize, colSize) {
		for (var i = 0; i < rowSize + 1; i++) {
			var row = tableElement.insertRow(i);
			for (var j = 0; j < colSize + 1; j++) {
				var cell = row.insertCell(j);
				this._createCellTitlesAndInputs(cell, i, j);
			}
		}
	};

	SpreadsheetTable.prototype._createInputCell = function(rowIndex, colIndex) {
		// input field with id of the cell
		return "<input " + this.ATTRS.ROW + "="+ rowIndex + " " + this.ATTRS.COL + "=" + SpreadsheetUtility.toLetters(colIndex) + " class='inputCell' />";
	};

	SpreadsheetTable.prototype._isATitleCell = function(row, col) {
		if ((row == 0 && col == 0) || row == 0 || col == 0) {
			return true;
		}
		return false;
	};

	SpreadsheetTable.prototype._createCellTitlesAndInputs = function(cell, i, j) {
		// Create labels and cell inputs
		if (this._isATitleCell(i, j)) {
			// apply styling
			cell.className += 'active';

			if (i == 0 && j == 0) {
				return;
			} else if (i == 0) {
				// col titles
				cell.innerHTML = SpreadsheetUtility.toLetters(j - 1);
			} else if (j == 0) {
				// row titles
				cell.innerHTML = i;
			}
		} else {
			cell.innerHTML = this._createInputCell(i, j - 1);
		}
	};

	SpreadsheetTable.prototype._isEquationCell = function($currentCell) {
		var firstChar = $currentCell.val().charAt(0);
		if (firstChar === '=') {
			return true;
		}
		return false;
	};

	SpreadsheetTable.prototype._storeEquationOnElement = function($currentCell) {
		$currentCell.attr(this.ATTRS.EQUATION, $currentCell.val());
	};

	SpreadsheetTable.prototype._removeEquationOnElement = function($currentCell) {
		$currentCell.removeAttr(this.ATTRS.EQUATION);
	};

	return SpreadsheetTable;
});