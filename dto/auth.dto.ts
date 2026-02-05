export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
    birth_year: number;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface VerifyDTO {
    email: string;
    otp: string;
}

export interface ForgotPasswordDTO {
    email: string;
    new_password: string;
    otp: string; 
}

export interface ResendOTPDTO {
    email: string;
}