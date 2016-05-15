requirejs(['jquery', 'bootstrap', 'app/spreadsheet_utility', 'app/spreadsheet_equations', 'app/spreadsheet_calculator', 'app/spreadsheet_table'], function($, bootstrap, SpreadsheetUtility, SpreadsheetEquations, SpreadsheetCalculator, SpreadsheetTable) {

    // The entire application is namespaced behind this App variable (Singleton)
    var App = new function() {

        /*
        =================================================================
        APP VARIABLES
        =================================================================
        */

        var $spreadsheet = $('#spreadsheet');
        
        var spreadsheet = document.getElementById('spreadsheet');

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

            $('#reload-button').click(function() {
                // clear data
                loadData = $('#spreadsheet tr').detach();
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

        var removeAlignmentClasses = function() {
            // alignment classes
            var alignClasses = ['align-left','align-center','align-right'];
            if ($selectedCell !== null) {
                for (var i = 0; i < alignClasses.length; i++) {
                    $selectedCell.removeClass(alignClasses[i]);
                }
            }
        };

        var toggleAlignmentOnButtonClick = function(buttonId, className) {
            $(buttonId).click(function() {
                if ($selectedCell === null) {
                    return;
                } else {
                    removeAlignmentClasses();
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

        var setUpAlignLeftButton = function() {
            toggleAlignmentOnButtonClick('#align-left-button', 'align-left');
        };
        
        var setUpAlignCenterButton = function() {
            toggleAlignmentOnButtonClick('#align-center-button', 'align-center');
        };

        var setUpAlignRightButton = function() {
            toggleAlignmentOnButtonClick('#align-right-button', 'align-right');
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
            setUpAlignLeftButton();
            setUpAlignCenterButton();
            setUpAlignRightButton();
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
                spreadsheetInit();  // Initialise App code
                listenersInit();    // Initialise all listeners
            }
        };
    };

    /* Initialise app when page loads */
    $(function() {
        App.init();
    });  

    return App;
});