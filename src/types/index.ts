export interface IUser {
    id: number,
    userName: string,
    userEmail: string
    passwordHash: string
}

export interface PollOption {
    text: string;
}

export interface CreatePollRequest {
    title: string;
    options: PollOption[];
    creator: string;
    userName: string;
    endDate: string;  // ISO date string
    isActive: boolean;
}