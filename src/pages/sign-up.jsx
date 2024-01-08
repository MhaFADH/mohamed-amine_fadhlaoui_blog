import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import Success from "@/web/components/ui/Success"
import apiClient from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { object } from "yup"

const initialValues = {
  username: "",
  email: "",
  password: "",
}
const validationSchema = object({
  username: usernameValidator.label("Username"),
  email: emailValidator.label("E-mail"),
  password: passwordValidator.label("Password"),
})
const SignUpPage = () => {
  const { isSuccess, mutateAsync } = useMutation({
    mutationFn: (values) => apiClient.post("/users", values),
  })
  const handleSubmit = async (values) => {
    await mutateAsync(values)

    return true
  }

  if (isSuccess) {
    return (
      <Success
        successMessage="We just sent you an e-mail. Please use the provided link to validate
          your account ❤️"
        redirectionMessage="Go to sign-in page."
        redirection="/sign-in"
      />
    )
  }

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormField
            name="username"
            type="text"
            placeholder="Enter your username"
            label="Username"
          />
          <FormField
            name="email"
            type="email"
            placeholder="Enter your e-mail"
            label="E-mail"
          />
          <FormField
            name="password"
            type="password"
            placeholder="Enter your password"
            label="Password"
          />
          <SubmitButton>Sign Up</SubmitButton>
        </Form>
      </Formik>
    </>
  )
}

export default SignUpPage
