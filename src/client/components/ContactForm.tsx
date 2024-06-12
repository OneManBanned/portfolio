import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, ContactSchema, ValidFieldNames } from "../types/types";
import FormField from "./FormField";
import axios from "axios";

function ContactForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>({ resolver: zodResolver(ContactSchema) });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post("/contact-form", data);

            const { errors = {} } = response.data;
            const fieldErrorMapping: Record<string, ValidFieldNames> = {
                name: "name",
                email: "email",
                message: "message",
            };

            const fieldWithError = Object.keys(fieldErrorMapping).find(
                (field) => errors[field],
            );

            if (fieldWithError) {
                setError(
                    fieldErrorMapping[fieldWithError],
                    { type: "server", message: errors[fieldWithError] },
                    { shouldFocus: true },
                );
            }
        } catch (error) {
            alert("Submitting form failed!");
        }
    };

    return (
        <form method="POST" onSubmit={handleSubmit(onSubmit)}>
            <FormField
                type="text"
                placeholder="Name"
                name="name"
                register={register}
                error={errors.name}
            />
            <FormField
                type="email"
                placeholder="Email"
                name="email"
                register={register}
                error={errors.email}
            />
            <FormField
                type="text"
                placeholder="Enter message"
                name="message"
                register={register}
                error={errors.message}
            />
            <button className="submit-button">Submit</button>
        </form>
    );
}

export default ContactForm;
