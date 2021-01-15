export interface MenuItemDTOInterface {
    id?: number,
    menuId?: number,
    typeMealId?: number,
    descripition: string,

    day?: DayMenuItemDTOInterface
}

interface DayMenuItemDTOInterface {
    dayId: number,
    numberDay: number,
}