module.exports = function() {
    const clientPath = './src/client/';
    return config = {
        jsFiles: clientPath + '/js/**/*.js',
        jsDestination: clientPath + '/dist/js',
        jsDesktop: clientPath + '/dist/js/desktop.js',
        jsMobile: clientPath + '/dist/js/mobile.js',
        cssSource: clientPath + '/css/styles.css',
        cssDestination: clientPath + '/dist/css',
        viewFiles: './src/server/views/*.ejs'
    };
};