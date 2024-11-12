// src/types/express.d.ts (or wherever your type declarations are located)

import User from '../models/user'; // Import your User model if needed, or define the type

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Define the type of `user`, or use `any` if the type is dynamic
    }
  }
}
