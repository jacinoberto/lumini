export type TeamMember = {
    id: number | string;
    name: string;
    avatar: string | null; // URL ou Base64
    specialties: string; // Ou string[] se for uma lista
    rating: number;
    cutsCount: number;
};