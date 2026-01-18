import { Solar } from 'lunar-javascript';
import { UserProfile } from '@/types';

export interface BaZiChart {
    year: string;
    month: string;
    day: string;
    hour: string;
    gender: '乾造' | '坤造';
}

export function calculateBaZi(profile: UserProfile): BaZiChart {
    const { birthYear, birthMonth, birthDay, birthHour, gender } = profile;
    // Note: lunar-javascript uses 0-23 for hour
    // If birthHour is a string like '0' (Zi), we map it roughly. 
    // For simplicity, we assume input is the starting hour integer (0, 1, 3...).

    const hour = parseInt(birthHour || '12', 10);

    const solar = Solar.fromYmdHms(
        parseInt(birthYear),
        parseInt(birthMonth),
        parseInt(birthDay),
        hour,
        0,
        0
    );

    const lunar = solar.getLunar();
    const baZi = lunar.getEightChar();

    return {
        year: baZi.getYear(),
        month: baZi.getMonth(),
        day: baZi.getDay(),
        hour: baZi.getTime(),
        gender: gender === 'male' ? '乾造' : '坤造'
    };
}
