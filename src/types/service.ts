export type CreateService = {
    service: String,
    price: number,
    duration: number
}

export type WorkingHour = {
    day_name: string;
    is_open: boolean;
    start_time: string;
    end_time: string;
};

export type OperatingDays = {
    weekdays: Boolean,
    saturday: Boolean,
    sunday: Boolean
}

export type OpeningHours = {
    operatingDayId: number,
    start: string,
    end: string
}