import { FieldError, UseFormRegister } from "react-hook-form"
import { z, ZodType } from "zod"

export type FormData = {
    name: string;
    email: string;
    message: string;
};

export type FormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
}

export type ValidFieldNames = 
    | "name"
    | "email"
    | "message"

export const ContactSchema: ZodType<FormData> = z
.object({
    name: z
        .string().trim().min(1, { message: "Name is required" })
        .max(500, { message: "Must be fewer than 500 characters"}),
    email: z 
        .string().trim().min(1, { message: "Email is required" })
        .email({ message: "Invalid email address"})
        .max(500, { message: "Must be fewer than 500 characters"}),
    message: z
        .string().trim().min(1, { message: "A message is required" })
        .max(5000, { message: "Must be fewer than 5000 characters"}),
})
