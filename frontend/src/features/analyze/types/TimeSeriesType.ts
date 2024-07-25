
export type AccessDataType = {
    timestamp: number;
    value : number;
}

export const TimeScale = {
    Minute:"Minute",
    Hour:"Hour",
    Day:"Day",
    Month:"Month",
}

export type TimeScaleType = (typeof TimeScale)[keyof typeof TimeScale];