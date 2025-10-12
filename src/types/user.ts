export type Address = {
    zipCode: String,
    street: String,
    city: String,
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