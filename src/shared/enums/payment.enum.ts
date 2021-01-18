export enum PaymentEnum {
    'Transferencia Bancária' = 1,
    'Boleto' = 2,
    'Dinheiro' = 3,
    'Cartão (Credito)' = 4,
    'Cartão (Débito)' = 5
}

export const LIST_PAYMENT = [
    { id: 1, name: PaymentEnum[1], editable: true },
    { id: 2, name: PaymentEnum[2], editable: false },
    { id: 3, name: PaymentEnum[3], editable: false },
    { id: 4, name: PaymentEnum[4], editable: false },
    { id: 5, name: PaymentEnum[5], editable: false },
];