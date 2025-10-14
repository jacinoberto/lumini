import type { CreateService } from "@/types/service.ts";
import type { OpeningHours, WorkingHour } from "@/types/service.ts";

export type Address = {
    zipCode: string,
    street: string,
    city: string,
    area: string,
    state: string,
    number: number | null
}

export type User = {
    name: string,
    socialSecurity: string,
    email: string,
    phone: string,
    password: string
}

export type RegisterProvider = {
    barberName: string;
    companyCode: string;
    phone: string;
    cover: string,
    profile: string,
    owner: User;
    address: Address;
}

export type OnboardingProvider = {
    profileImage: string | null,
    coverImage: string | null,
    description: string,
    address: Address,
    workingHours: WorkingHour[],
    service: CreateService,
}