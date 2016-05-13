// The entire application is namespaced behind this App variable (Singleton)
var App = new function() {

    /*
    =================================================================
    APP VARIABLES
    =================================================================
    */

    var $spreadsheet = $('#spreadsheet');
    
    var spreadsheet = document.getElementById("spreadsheet");

    // Helper class for equation calculator
    var spreadsheetEquations = new SpreadsheetEquations();

    var equationCalculator = new SpreadsheetCalculator(spreadsheetEquations);

    var spreadsheetTable = new SpreadsheetTable();

    // Used for formatting cells
    var $selectedCell = null;

    /*
    =================================================================
    BUSINESS LOGIC
    =================================================================
    */

    var setUpSpreadSheetTable = function() {
        var size = 50;
        spreadsheetTable.createTable(spreadsheet, size, size);
    };

    /* Listeners */

    var onFocusInputListener = function($inputCells) {
        // On selection of cell
        $inputCells.focus(function() {
            $selectedCell = $(this);

            // Show equation
            var equationAttr = spreadsheetTable.ATTRS.EQUATION;
            if (SpreadsheetUtility.hasAttr($selectedCell.attr(equationAttr))) {
                $selectedCell.val($selectedCell.attr(equationAttr));
            }
        });
    };

    var onEnterKeyListener = function($inputCells) {
        $inputCells.keyup(function(e) {
            // Enter key
            if (e.which == 13) {
                $(this).blur(); 
            } 
        });
    };

    var onBlurInputListener = function($inputCells) {
        // On leaving the cell
        $inputCells.blur(function() {
            // Save
            spreadsheetTable.storeCellData($(this));
            // Update equation cells
            equationCalculator.calculateAllEquations(spreadsheetTable);
        });
    };

    /* Button Setups */

    var setUpReloadButton = function() {
        var loadData;

        $("#reload-button").click(function() {
            // clear data
            loadData = $("#spreadsheet tr").detach();
            setTimeout(function() {
                // Reload the HTML elements
                loadData.appendTo($spreadsheet);
            }, 50);
         
        });
    };

    var toggleClassOnButtonClick = function(buttonId, className) {
        $(buttonId).click(function() {
            if ($selectedCell === null) {
                return;
            } else if ($selectedCell.hasClass(className)) {
                $selectedCell.removeClass(className);
            } else {
                $selectedCell.addClass(className);    
            }
        });
    };

    var setUpBoldButton = function() {
        toggleClassOnButtonClick('#bold-button', 'bold');
    };

    var setUpItalicsButton = function() {
        toggleClassOnButtonClick('#italics-button', 'italics');
    };

    var setUpUnderlineButton = function() {
        toggleClassOnButtonClick('#underline-button', 'under-line');
    };

    /*
    =================================================================
    APP BUSINESS LOGIC INITIALISATION
    =================================================================
    */

    var buttonsInit = function() {
        setUpReloadButton();
        setUpBoldButton();
        setUpItalicsButton();
        setUpUnderlineButton();
    };

    var spreadsheetInit = function() {
    	setUpSpreadSheetTable();
    };

    var listenersInit = function() {
        var $inputCells = $('.inputCell');

        onBlurInputListener($inputCells);
        onFocusInputListener($inputCells);
        onEnterKeyListener($inputCells);
    };

    return {
    	init: function() {
            buttonsInit();      // Initialise Buttons
            spreadsheetInit(); 	// Initialise App code
            listenersInit();    // Initialise all listeners
        }
    };
};

/* Initialise app when page loads */
$(function() {
	App.init();
});