
export class AppUser
{
    constructor( userName ){
        this.name = userName;
        this.currentBalance = 0.0;
        this.debitRecords = [];     // what this user owes others
        this.creditRecords = [];    // what others owe him
    }
}

// When user1 pays xAmount to user2 and user1 does not have enough funds,
// we create a DebitRecord for user1 and a CreditRecord for user2 for 
// xAmount. This may be contrary to the normal Accounting usage.

// A debit record indicates that the user owes the creditor some money
export class DebitRecord
{
    constructor( toUser, amount ){
        this.creditorName = toUser;
        this.creditAmount = amount;
    }
}

// A Credit record indicates that the debitor owes the user money
export class CreditRecord
{
    constructor( fromUser, amount ){
        this.debitorName = fromUser;
        this.debitAmount = amount;
    }
}





