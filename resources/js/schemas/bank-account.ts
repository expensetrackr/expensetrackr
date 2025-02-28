import { z } from "zod";

export const bankAccountProvider = z.enum(["teller", "mx"]);
