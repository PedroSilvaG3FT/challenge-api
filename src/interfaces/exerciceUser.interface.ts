export interface ExerciceUserInterfaceDTO {
    id: number,
    userId: number,
    days: {
        dayId: number,
        exercices: {
            amount: string,
            linkUrl: string,
            isLink?: boolean,
            exercice: number,
        }[]

    }[]
}

export interface DayExerciceMemberInterface {
    name: string,
    dayId: number,
    numberDay: number,
    exercices?: ItemExerciceMemberInterface[]
}

export interface ItemExerciceMemberInterface {
    id?: number,
    amount: string,
    linkUrl?: string,
    isLink?: boolean,
    exercice?: {
        id: number,
        name: string,
    },
}