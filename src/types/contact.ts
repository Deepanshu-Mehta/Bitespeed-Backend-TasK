export interface ContactRequest {
    email?: string;
    phoneNumber?: string;
  }
  
  export interface ContactResponse {
    contact: {
      primaryContatctId: number;
      emails: string[];
      phoneNumbers: string[];
      secondaryContactIds: number[];
    };
  }