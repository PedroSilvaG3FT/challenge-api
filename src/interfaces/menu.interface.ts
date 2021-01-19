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
    imageItem: string,
    rating: number
}
export interface MenuItemDayInterface {
    id?: number,
    menuId: number,
    menuItemId: number,
    dayId: number,
    numberDay: number,
    dateCreation: Date
}

export interface MealInterface {
    menuItemId: number,
    typeMealName: string,
    typeMealId: number,
    descripition: string,

    menuUserItemImageId?: number,
    imageItem?: string,
    rating?: number | string
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