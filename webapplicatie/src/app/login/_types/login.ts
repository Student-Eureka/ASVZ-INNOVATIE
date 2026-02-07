export interface LoginPayload {
  gebruikersnaam: string;
  wachtwoord: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}
