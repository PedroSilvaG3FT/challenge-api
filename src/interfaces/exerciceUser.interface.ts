export interface ExerciceUserInterfaceDTO {
    id: number,
    userId: number,
    days: {
        dayId: number,
        exercices: {
            amount: number,
            exercice: number
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
    amount: number,
    exercice?: {
        id: number,
        name: string,
    },
}