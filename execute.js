const { exec } = require('pkg')
exec([ './server.js', '--target', 'node12-win', '--output', 'app.exe' ]).then(function() {
    console.log('Done!')
}).catch(function(error) {
    console.error(error)
})
//node ./execute.js ./execute.js