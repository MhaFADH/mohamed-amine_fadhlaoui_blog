import { emailValidator, usernameValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import SubmitButton from "@/web/components/ui/SubmitButton"
import apiClient from "@/web/services/apiClient"
import { useMutation } from "@tanstack/react-query"
import { Formik } from "formik"
import { object } from "yup"
import { useSession } from "@/web/components/SessionContext"
import { useRouter } from "next/router"

const initialValues = {
  username: "",
  email: "",
}
const validationSchema = object({
  username: usernameValidator.label("Username"),
  email: emailValidator.label("E-mail"),
})
const EditProfile = () => {
  const { query } = useRouter()
  const userId = parseInt(query.userId, 10)
  const { session } = useSession()
  let authorized = false

  if (session) {
    authorized = parseInt(userId, 10) === session.id || session.isAdmin
  }

  const { mutateAsync } = useMutation({
    mutationFn: (values) => apiClient.patch(`/users/${userId}`, values),
  })
  const handleSubmit = async (values, { resetForm }) => {
    await mutateAsync(values)
    resetForm()

    return true
  }

  return authorized ? (
    <div>
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
          <SubmitButton>Edit</SubmitButton>
        </Form>
      </Formik>
    </div>
  ) : (
    <p>FORBIDDEN</p>
  )
}

export default EditProfile
