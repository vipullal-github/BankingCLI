
export class AppUser
{
    constructor( userName ){
        this.name = userName;
        this.currentBalance = 0.0;
        this.payableRecords = [];     // what this user owes others
        this.receivableRecords = [];    // what others owe him
    }

    removeEmptyPayableRecords(){
        let res = this.payableRecords.filter( rec => rec.payableAmount != 0 );
        this.payableRecords = res;
    }

    removeEmptyReceivableRecords(){
        let res = this.receivableRecords.filter( rec => rec.receivableAmount != 0 );
        this.receivableRecords = res;
    }


    toConsole(){
        console.log( `Name: ${this.name}, Balance: ${this.currentBalance}` );
        if( this.payableRecords && this.payableRecords.length!= 0){
            this.payableRecords.forEach( (pr)=>{
                console.log(`   Owes ${pr.payableAmount} to ${pr.payableToName}`);
            });    
        }
        if( this.receivableRecords && this.receivableRecords.length!= 0){
            this.receivableRecords.forEach( (rr)=>{
                console.log(`   Will receive ${rr.receivableAmount} from ${rr.receiveableFromName}`);
            });
        }
    }
}

// When user1 pays xAmount to user2 and user1 does not have enough funds,
// we create a PayableRecord for user1 and a ReceivableRecord for user2 for 
// xAmount. This may be contrary to the normal Accounting usage.

export class PayableRecord
{
    constructor( toUser, amount ){
        this.payableToName = toUser;
        this.payableAmount = amount;
    }
}

// A ReceivableRecord record 
export class ReceivableRecord
{
    constructor( fromUser, amount ){
        this.receiveableFromName = fromUser;
        this.receivableAmount = amount;
    }
}





