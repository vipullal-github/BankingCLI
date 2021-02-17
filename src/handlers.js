const database = require("./Database");
const {AppUser,DebitRecord,CreditRecord} = require('./models');
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
    let usrName = context.rxCapture[1];
    let user = db.getOrCreateUserWithName( usrName );
    console.log(`Hello, ${user.name}.`);
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
    let amt = Number(context.rxCapture[1]);

    if( amt <= 0 ){ 
        // should not happen because we used regEX to parse a non-negative number
        throw new Error(`Invalid topup amount ${amt}`);
    }
    if( usr.debtRecords.empty()){
        usr.currentBalance += amt;
    }
    else{
        debugger;
        // adjust the amount amongst the debtors (people who this account owes money)
        for(let i = 0; i < usr.debtRecords.length && amt; i++ ){
            let dr = usr.debitRecords[i];
            let otherUser = db.getUserWithName( dr.creditorName );
            if( !otherUser ){
                throw new Error(`Error: Record for ${dr.creditorName} not found!`);
            }
            let adjustedAmt = ( dr.creditAmount <= amt) ? dr.creditAmount: amt;
            dr.creditAmount -= adjustedAmt;
            amt -= adjustedAmt;
            otherUser.currentBalance += adjustedAmt;            
        }
    }
}

// --------------------------------------------
const payHandler = ( context ) =>{
    if( !context.currentUser ){
        throw new Error("User must login before he can make a payment!");
    }
    let user1 = context.currentUser;
    let user2Name = context.rxCapture[1];
    let amt = Number(context.rxCapture[2]);
    // This should never happen. We used RegX to parse the numeric...
    if( !amt ){
        throw new Error(`Invalid ${context.rxCapture[2]}`);
    }
    let user2 = db.getOrCreateUserWithName( user2Name );
    if( !user2 ){
        throw new Error(`User ${user2Name} does not exist in our records!`);
    }
    let balance = user1.currentBalance;
    //console.log(`Balance is ${balance} and to pay is ${amt}`);
    if( balance >= amt ){
        user1.currentBalance -= amt;
        user2.currentBalance += amt;
    }
    else{
        debugger;
        let cashAmount = user1.currentBalance;
        user1.currentBalance -= cashAmount;
        user2.currentBalance += cashAmount;
        amt -= cashAmount;
        let dr = new DebitRecord (user2.name, amt );
        let cr = new CreditRecord( user1.name, amt );
        user1.debitRecords.push( dr );  // user1 owes user2 amt 
        user2.creditRecords.push( cr );

    }

};

module.exports = {echoHandler, quitHandler, loginHandler, logoutHandler, topupHandler, payHandler};