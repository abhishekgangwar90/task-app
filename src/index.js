const chalk = require('chalk');
const app = require('./app');


// adding mongoose so it can load first and setup db connection.
require('./db/mongoose');

const port = process.env.PORT;

/**
 * starting the server and listening on port
 */
app.listen(port,(err, res) =>{
    if(err){
        console.log(chalk.red(err))
    }
    console.log(chalk.green('Listening on Port '+ port))
})