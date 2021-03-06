// simple in-memory database
const AppUser = require("./models");

class Database {
    // ---------------------
    constructor(){
        this.usersDatabase = {};
    }


    // ----------------------------------
    addUser( appUser ){
        this.usersDatabase[ appUser.name ] = appUser;
    }

    // ----------------------------------
    getOrCreateUserWithName(name){
        let usr = this.usersDatabase[name];
        if( !usr ){
            let appUser = new AppUser.AppUser( name );
            this.addUser( appUser );
            return appUser;
        }
        else{
            return usr;
        }
    }

    // ---------------------------------
    getUserWithName = (name) =>{
        return  this.usersDatabase[name];
    }

    // ---------------------------------
    getUsersList(){
        let userNames = Object.keys( this.usersDatabase );
        return userNames;
    }


}


module.exports = {Database}