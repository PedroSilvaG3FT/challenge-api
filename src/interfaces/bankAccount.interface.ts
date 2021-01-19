export interface BankAccountInterface {
    id?: number,
    bank: string,
    agency: string,
    account: string,
    document: string,
    nameOwner: string,

    active?: boolean,
    dateCreation?: Date
}