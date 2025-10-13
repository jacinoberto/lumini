import type { OnboardingProvider } from "@/types/user.ts";
import type { WorkingHour } from "@/types/service.ts";

export default function userMock(): OnboardingProvider {
    const providerOnboarding: OnboardingProvider = {
        profileImage: null,
        coverImage: null,
        description: '',
        address: {
            zipCode: '',
            street: '',
            city: '',
            area: '',
            state: '',
            number: null
        },
        workingHours: [
            {
                day_name: 'Segunda-feira',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
            {
                day_name: 'Terça-feira',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
            {
                day_name: 'Quarta-feira',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
            {
                day_name: 'Quinta-feira',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
            {
                day_name: 'Sexta-feira',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
            {
                day_name: 'Sábado',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
            {
                day_name: 'Domingo',
                is_open: false,
                start_time: '00:00',
                end_time: '00:00',
            },
        ] as WorkingHour[],
        service: {
            service: '',
            price: 0,
            duration: 15
        }
    };

    return providerOnboarding;
}