"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import FormCheckbox from "@/src/components/ui/formCheckbox";
import { loginFormSchema, loginFormType } from "@/src/lib/validations/login";

const Login = () => {
  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (values: loginFormType) => {
    try {
      const { rememberMe } = values;
      console.log(values);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      //replace with token from backend
      const mockToken = "mock-jwt-token";

      if (rememberMe) {
        localStorage.setItem("authToken", mockToken);
      } else {
        sessionStorage.setItem("authToken", mockToken);
      }

      console.log("Login successful!");
      //router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          name="email"
          label="Email address"
          placeholder="Enter email address"
          type="email"
        />
        <FormInput
          name="password"
          label="Password"
          placeholder="Enter password"
          type="password"
        />
        <FormCheckbox name="rememberMe" label="Remember me" />
        <FormButton
          text="Log in"
          loadingText="Logging in..."
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          className="mt-3! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>
    </Form>
  );
};

export default Login;
