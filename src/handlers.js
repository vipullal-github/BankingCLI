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
    let usrName = context.rxCapture[1];
    let user = db.getOrCreateUserWithName( usrName );
    console.log(`Hello ${user.name}!\nYour current balance is ${user.currentBalance}\n`);
    context.currentUser = user;
}

// --------------------------------------------
const logoutHandler = ( context ) =>{
    let usr = context.currentUser;
    if( usr ){
        context.currentUser = null;
        console.log( `${usr.name} is now logged out\n`);
    }
}


// --------------------------------------------
const topupHandler = ( context ) =>{
    let usr = context.currentUser;
    if( !usr ){
        throw Error("You must login to top-up yor account! There is no current user ");
    }
    // extract the amount...
    let amt = context.rxCapture[1];
    if( amt <= 0 ){
        throw new Error(`Invalid topup amount ${amt}`);
    }
    usr.currentBalance += amt;
    console.log(`Your balance is ${usr.currentBalance}\n`)
}

// --------------------------------------------
const payHandler = ( context ) =>{
    if( !context.currentUser ){
        throw new Error("User must login before he can make a payment!");
    }
    let user2 = context.rxCapture[1];
    let amt = Number(context.rxCapture[2]);
    // This should never happen. We used RegX to parse the numeric...
    if( !amt ){
        throw new Error(`Invalid ${context.rxCapture[2]}`);
    }
    let dbUser = db.getUserWithName( user2 );
    if( !dbUser ){
        throw new Error(`User ${user2} does not exist in our records!`);
    }
    let balance = context.currentUser.currentBalance;
    if( balance > amt ){

    }

};

module.exports = {echoHandler, quitHandler, loginHandler, logoutHandler, topupHandler};