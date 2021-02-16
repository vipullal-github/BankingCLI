
export class AppUser
{
    constructor( userName ){
        this.name = userName;
        this.currentBalance = 0.0;
        this.owesRecords = [];
    }
}


export class OwesRecord
{
    constructor( toUser, amount ){
        this.creditorName = toUser.name;
        this.creditAmount = amount;
    }
}




