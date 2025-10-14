export type CreateService = {
    service: string,
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
    weekdays: boolean,
    saturday: boolean,
    sunday: boolean
}

export type OpeningHours = {
    operatingDayId: number,
    start: string,
    end: string
}

export type Appointment = {
    id: string,
    profile: string | null;
    name: string;
    service: string;
    hour: string;
};