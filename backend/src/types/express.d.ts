import "express";
declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}
