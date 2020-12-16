export interface MenuInterface {
    id?: number,
    name: string,
    qtdDays: number,
    active: boolean,
    dateCreation: Date,
}
export interface MenuItemInterface {
    id?: number,
    menuId: number,
    typeMealId: number,
    descripition: string,
    dateCreation: Date,
}
export interface MenuItemDayInterface {
    id?: number,
    menuItemId: number,
    dayId: number,
    numberDay: number,
    dateCreation: Date
}

export interface MealInterface {
    typeMealName: string,
    typeMealId: number,
    descripition: string
}

export interface MenuInterfaceDTO {
    id?: string,
    name: string,
    days: MenuDayInterfaceDTO[]
}
export interface MenuDayInterfaceDTO { 
    dayId: number,
    meals: MenuMealInterfaceDTO[]
}
export interface MenuMealInterfaceDTO { 
    id?: number,
    typeMealId: number,
    descripition: string
}