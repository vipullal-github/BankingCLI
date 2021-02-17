const readLine = require('readline');
import {echoHandler, quitHandler, loginHandler, logoutHandler, topupHandler, payHandler, printAllHandler } from "./handlers";

// --------------------------------------------
const displayHelp = ()=>{
    let helpText = `
        Welcome to your friendly Banking App. Your money is safe with us!
        Please use the following commands:
           1.   login <userName>
           2.   logout
           3.   topup <amount>
           4.   pay <userName> <amount>
           5.   printAll
           6.   quit
           7.   help
    `;
    console.log(`${helpText}`);
}


const commands = [
        {
            name:'login',
            handler:loginHandler,
            regx: /^\s*login\s+([a-z]+)\s*$/
        },
        {
            name:'logout',
            handler:logoutHandler,
            regx:/^\s*logout\s*$/
        },
        {
            name:'topup',
            handler:topupHandler,
            regx:/^\s*topup\s+([0-9.]+)\s*$/
        }
        ,
        {
            name:'pay',
            handler:payHandler,
            regx: /pay\s+([a-z]+)\s+(\d{0,7}\.?\d{0,2})/
        },
        {
            name:'printAll',
            handler:printAllHandler,
            regx:/^\s*printAll\s*$/
        },
        {
            name:'quit',
            handler:quitHandler,
            regx:/^\s*quit\s*$/
        },
        {
            name:'help',
            handler:displayHelp,
            regx:/^\s*help\s*$/
        }
    ];

// TODO: make a class
let AppContext = {
    doneFlag: false,
    currentCommand:"",
    rxCapture: {},
    currentUser: null 
}

let reader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
    prompt: "> "
});

// --------------------------------------------
const printUserDetails = () => {
    let user = AppContext.currentUser;
    if( user ){
        console.log(`Your current balance is ${user.currentBalance}`);
        user.payableRecords.forEach( e => {
            console.log(`You owe ${e.payableToName} ${e.payableAmount}`);      
        });
        user.receivableRecords.forEach( e => {
            console.log(`${e.receiveableFromName} owes you ${e.receivableAmount}`);
        });    
    }
    console.log("\n");      // stay neat
}



// --------------------------------------------
const evalCommand = ( inputText ) => {
    if( !inputText ){
        return;
    }
    //console.log(`\nEvaluating cmd [${inputText}]`);
    // debugger;


    AppContext.currentCommand = inputText;  // save it just in case
    AppContext.rxCapture = undefined;
    let commandToExecute = undefined;
    
    commands.find( (e) => {
        let m = inputText.match( e.regx );
        if( m ){
            AppContext.rxCapture = m;
            commandToExecute = e;
        }
    });

    if( !commandToExecute ){
        displayHelp();
        return;
    }

    try{
        commandToExecute.handler( AppContext );
        printUserDetails();
    }
    catch( e ){
        console.log(`Woops!  ${e}`)
    }
}




// --------------------------------------------
const main = ( args )=>{
    console.log("Welcome to the Banking App...");
    console.log("(type help to get a summary of all commands)");
    let testCommands = ["login vipul","topup 100", "pay giang 100", "pay bob 30", "pay bob 10", "printAll"];
    testCommands.forEach( (cmd)=>{
        console.log(`Running: [${cmd}]`)
        evalCommand(cmd);
    })

    reader.prompt();
    reader.on('line', (line) =>{
        evalCommand(line);
        if( AppContext.doneFlag ){
            reader.close();
        }
        else{
            reader.prompt();
        }
    }).on('close', function(){
        console.log("Quiting app!");
        process.exit(0);
    })    
}

module.exports = {main};


