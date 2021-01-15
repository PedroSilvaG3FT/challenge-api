export interface MenuItemDTOInterface {
    id?: number,
    menuId?: number,
    typeMealId?: number,
    descripition: string,

    day?: DayMenuItemDTOInterface
}

interface DayMenuItemDTOInterface {
    id: number,
    dayId: number,
    numberDay: number,
}