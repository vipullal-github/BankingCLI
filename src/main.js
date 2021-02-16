const readLine = require('readline');
import {echoHandler, quitHandler, loginHandler, logoutHandler, topupHandler } from "./handlers";


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
            handler:echoHandler,
            regx:/^\s*pay\s+([0-9.]+)\s*$/
        },
        {
            name:'quit',
            handler:quitHandler,
            regx:/^\s*quit\s*$/
        },
        {
            name:'help',
            handler:echoHandler,
            regx:/^\s*help\s*$/
        }
    ];


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
const displayHelp = ( errorText )=>{
    let helpText = `
        Please use the following commands:
           1.   login <userName>
           2.   logout
           3.   topup
           4.   pay <userName>
           5.   quit
           6.   help
    `;
    console.log(`Invalid input.\n${helpText}`);
}


// --------------------------------------------
const evalCommand = ( inputText ) => {
    if( !inputText ){
        return;
    }
    //console.log(`\nEvaluating cmd [${inputText}]`);
    // all commands are 
    // debugger;
    let rxCmdSplitter = /\s*([a-z]+)\s*/
    let cmdText = rxCmdSplitter.exec(inputText);
    if( !cmdText ){
        displayHelp();
        return;
    }
    console.log(`executing "${cmdText[1]}" `);
    let handler = commands.find( (c) => c.name === cmdText[1] );
    if( !handler ){
        displayHelp();
        return;
    }
    else{
        AppContext.currentCommand = inputText;
        try{
            handler.handler( AppContext );
        }
        catch( e ){
            console.log(`Woops!  ${e}`)
        }
    }
}

// --------------------------------------------
const main = ( args )=>{
    console.log("Welcome to the Banking App...");

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


