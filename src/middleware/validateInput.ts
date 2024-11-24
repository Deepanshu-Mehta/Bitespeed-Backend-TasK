import { Request, Response, NextFunction } from 'express';
import { ContactRequest } from '../types/contact';

export function validateContactInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { email, phoneNumber }: ContactRequest = req.body;

  // Check if both email and phoneNumber are missing or null/undefined
  if ((!email && !phoneNumber) || (email === null && phoneNumber === null)) {
    res.status(400).json({
      error: "At least one of email or phoneNumber is required"
    });
    return;
  }

  // Validate email
  if (email !== undefined && email !== null) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: "Invalid email format"
      });
      return;
    }
  }

  // Validate phone number
  if (phoneNumber !== undefined && phoneNumber !== null) {
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      res.status(400).json({
        error: "Phone number should only contain digits"
      });
      return;
    }
  }

  next();
}