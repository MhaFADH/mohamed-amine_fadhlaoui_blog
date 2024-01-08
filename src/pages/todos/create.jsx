import { todoDescriptionValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import axios from "axios"
import { Formik } from "formik"
import { object } from "yup"

const initialValues = {
  description: "",
  categoryId: 40,
}
const validationSchema = object({
  description: todoDescriptionValidator.label("Description"),
})
const CreateTodoPage = () => {
  const handleSubmit = async (values, { resetForm }) => {
    await axios.post("http://localhost:3000/api/todos", values)

    resetForm()
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormField name="description" placeholder="Enter a description" />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 active:bg-blue-700 text-2xl text-white"
        >
          Submit
        </button>
      </Form>
    </Formik>
  )
}

export default CreateTodoPage
