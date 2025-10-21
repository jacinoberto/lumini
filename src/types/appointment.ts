export type Appointment = {
    id: number | string
    clientName: string
    serviceName: string
    time: string
    status?: "pending" | "confirmed" | "completed"
}