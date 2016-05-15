requirejs.config({
    //By default load any module IDs from js/vendor
    baseUrl: 'js/vendor',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        jquery: [
            'https://code.jquery.com/jquery-1.12.0.min',
            // CDN fallback
            'jquery-1.12.0.min'
        ],
        bootstrap: 'bootstrap.min'
    },
    shim: {
        bootstrap: {
           deps: ['jquery']
        }
    }
});

// Start the main app logic.
requirejs(['../plugins','app/spreadsheet_main']);
