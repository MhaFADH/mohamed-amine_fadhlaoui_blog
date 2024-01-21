import { postContentValidator, postTitleValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import axios from "axios"
import { Formik } from "formik"
import { object } from "yup"
import { useSession } from "@/web/components/SessionContext"
import { useRouter } from "next/router"

const initialValues = {
  title: "",
  content: "",
}
const validationSchema = object({
  title: postTitleValidator.label("Title"),
  content: postContentValidator.label("Content"),
})
const CreatePost = () => {
  const { session } = useSession()
  const router = useRouter()
  const handleSubmit = async (values) => {
    await axios.post("http://localhost:3000/api/posts", values)
    router.push("/")
  }

  return session ? (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormField name="title" placeholder="Enter a title" />
        <FormField name="content" placeholder="Put your content" />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 active:bg-blue-700 text-2xl text-white"
        >
          Create
        </button>
      </Form>
    </Formik>
  ) : (
    <p>FORBIDDEN</p>
  )
}

export default CreatePost
