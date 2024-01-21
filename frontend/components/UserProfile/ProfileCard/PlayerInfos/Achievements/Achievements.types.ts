export interface achievementsObj {
    id: number,
    state: boolean,
    type: string,
    description: string,
    icon: any // give it an SVGelement
}

export interface AchievementsProps {
    achievementsArray: achievementsObj[];
}