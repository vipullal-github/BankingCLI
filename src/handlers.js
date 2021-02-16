const database = require("./Database");
const db = new database.Database();


// --------------------------------------------
const quitHandler = ( context ) =>{
    console.log("Quit called!");
    context.doneFlag = true;
}



// --------------------------------------------
const echoHandler = ( context ) =>{
    console.log(`Command [${context.currentCommand}] not implemented yet!`);
}

// --------------------------------------------
const loginHandler = ( context ) =>{
    if( context.currentUser != null ){
        throw new Error(`User ${context.currentUser.name} is already logged in. Please logout first..`)
    }

    console.log(`Logging in [${context.currentCommand}] `);
    console.log(`Database is ${db}`);
    let user = db.getOrCreateUserWithName('vipul');    // TODO:!!!
    console.log(`Hello ${user.name}!\nYour current balance is ${user.currentBalance}`);
    context.currentUser = user;
}

// --------------------------------------------
const logoutHandler = ( context ) =>{
    let usr = context.currentUser;
    if( usr ){
        context.currentUser = null;
        console.log( `${usr.name} is now logged out`);
    }
}


// --------------------------------------------
const topupHandler = ( context ) =>{
    let usr = context.currentUser;
    if( !usr ){
        throw Error("You must login to top-up yor account! There is no current user ");
    }
    // extract the amount...
    let amtRx = /
    let amt = 0.0;
}


module.exports = {echoHandler, quitHandler, loginHandler, logoutHandler, topupHandler};