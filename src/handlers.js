const database = require("./Database");
const {AppUser,PayableRecord,ReceivableRecord} = require('./models');
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
    if( usr.payableRecords.length == 0 ){
        usr.currentBalance += amt;
    }
    else{
        //debugger;
        // adjust the amount amongst the payable (people who this account owes money)
        // NB. This would be faster if We adjust from the rear of the array so that we can pop off
        // items as they get fulfiled  
        for(let i = 0; i < usr.payableRecords.length && amt; i++ ){
            let pr = usr.payableRecords[i];
            let otherUser = db.getUserWithName( pr.payableToName );
            if( !otherUser ){
                // TODO: Throwing an exception here is not the best solution
                throw new Error(`Error: Record for ${pr.payableToName} not found!`);
            }
            let adjustedAmt = ( pr.payableAmount <= amt) ? pr.payableAmount: amt;
            pr.payableAmount -= adjustedAmt;
            amt -= adjustedAmt;
            otherUser.currentBalance += adjustedAmt;
            
            // adjust the amount adjusted on the other user too.
            for( let i = 0; i < otherUser.receivableRecords.length; i++ ){
                let rr = otherUser.receivableRecords[i];
                if( rr.receiveableFromName === usr.name ){
                    rr.receivableAmount -= adjustedAmt;
                    if( rr.receivableAmount === 0){
                        otherUser.removeEmptyReceivableRecords();
                    }
                    break;
                }
            }
        }
        // remove all the those with 0 balance
        usr.removeEmptyPayableRecords();
        if( amt ){
            usr.currentBalance += amt;
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
        //debugger;
        let cashAmount = user1.currentBalance;
        user1.currentBalance -= cashAmount;
        user2.currentBalance += cashAmount;
        amt -= cashAmount;
        let pr = user1.payableRecords.find( (item)=>{
            return item.payableToName === user2.name;
        });
        if( !pr){
            pr = new PayableRecord (user2.name, amt );
            user1.payableRecords.push( pr );  // user1 owes user2 amt 
        }
        else{
            pr.payableAmount += amt;
        }
        let rr = user2.receivableRecords.find( (item)=>{
            return item.receiveableFromName === user1.name;
        });
        if( !rr ){
            rr = new ReceivableRecord( user1.name, amt );
            user2.receivableRecords.push( rr );
        }
        else{
            rr.receivableAmount += amt;
        }

    }
}


// --------------------------------------------
const printAllHandler = ( context ) =>{
    //debugger;
    let userNames = db.getUsersList();
    for (const name of userNames) {
        let usr = db.getUserWithName(name);
        console.log( usr);
        // usr.toConsole();
        //console.log("-------");
    }
    console.log("---- End of records ---");
}

module.exports = {echoHandler, quitHandler, loginHandler, logoutHandler, topupHandler, payHandler, printAllHandler};