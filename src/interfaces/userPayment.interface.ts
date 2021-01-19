export interface UserPaymentInterface {
    id: number,
    userId: number,
    paymentId: number,
    value: number,
    active: boolean,
    dueDate: Date,
    dateCreation: Date,
}