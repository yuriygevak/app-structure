module.exports = function() {

    var client = './src/';
    var clientApp = client + 'app/';
    var build = './build/';

    var config = {

        /*** file path ****/
        build: build,
        alljs: client + 'script/main.js',
        sass: client + 'sass/styles.scss',
        sassWatch: client + 'sass/**/*scss',
        index: client + 'index.html',
        html: clientApp + '**/*.html',

        /*** not optimized files ***/
        css: 'styles.css',
        cssSrc: build + 'css/styles.css',
        js: 'main.js',
        jsSrc: build + 'js/main.js'

    };

    return config;
};