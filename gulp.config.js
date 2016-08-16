module.exports = function() {
    const clientPath = './src/client/';
    return config = {
        alljs: [
            clientPath + 'js/*.js'
        ],
        cssSource: clientPath + '/css/styles.css',
        cssDestination: clientPath + '/dist/css'
    };
};