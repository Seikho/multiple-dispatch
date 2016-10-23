const del = require('del');
del([
    'src/**/*.js',
    'src/**/*.map',
    'test/**/*.js',
    'test/**/*.map',
]);