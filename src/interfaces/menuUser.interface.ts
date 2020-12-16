import { MealInterface } from "./menu.interface";

export interface MenuUserInterface {
    id?: number;
    userId: number;
    menuId: number;
    active: boolean;
    dateCreation: Date;
}

export interface MemberMenuInterface {
    menuId: number
    qtdDays: number
    menuName: string,
    menuMemberId: number,
    days: DayMenuInterface[],
}

interface DayMenuInterface {
    dayId: number,
    dayName: string,
    numberDay: number,
    meals: MealInterface[]
}
