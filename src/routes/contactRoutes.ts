import { Router } from 'express';
import { Request, Response } from 'express';
import { handleIdentifyContact } from '../controllers/contactController';
import { validateContactInput } from '../middleware/validateInput';

const router = Router();

router.post(
  '/identify',
  validateContactInput,handleIdentifyContact
//   async (req: Request, res: Response) => {
//     return handleIdentifyContact(req, res);
//   }
);

export default router;