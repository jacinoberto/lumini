import type { CreateService } from "@/types/service.ts";
import type { OpeningHours, WorkingHour } from "@/types/service.ts";

export type Address = {
    zipCode: String,
    street: String,
    city: String,
    area: String,
    state: String,
    number: Number | null
}

export type User = {
    name: String,
    socialSecurity: String,
    email: String,
    phone: String,
    password: String
}

export type RegisterProvider = {
    barberName: String;
    companyCode: String;
    phone: String;
    cover: String,
    profile: String,
    owner: User;
    address: Address;
}

export type OnboardingProvider = {
    profileImage: String | null,
    coverImage: String | null,
    description: String,
    address: Address,
    workingHours: WorkingHour[],
    service: CreateService,
}