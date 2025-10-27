import { z } from "zod";

export const authorZodSchema = z.object({
  name: z.string({ error: "Author name is required!" }),
  image: z.string().optional(),
  followersCount: z.number().min(0).optional(),
  description: z.string().optional(),
});

export const updateAuthorZodSchema = authorZodSchema.partial();
