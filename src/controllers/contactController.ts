import { Request, Response } from 'express';
import { identifyContact } from '../services/contactService';
import { ContactRequest } from '../types/contact';

export async function handleIdentifyContact(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const data: ContactRequest = req.body;
    
    const result = await identifyContact(data);
    res.json(result);
  } catch (error) {
    console.error('Error in identify:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 