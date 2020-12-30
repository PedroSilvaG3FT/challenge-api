export interface UserInterface {
    id?: number;
    name: string;
    email: string;
    password: string;
    cpf: string;
    age: number;
    comments?: string;
    phoneNumber?: number;
    startingWeight?: number;
    goalWeight?: number;
    height?: number;
    payday?: number;
    isAdm?: boolean;
    image?: string;
    acceptTerm?: boolean;
    currentStep?: number;
    active: boolean;
    dateCreation: Date;
}
