import { postContentValidator, postTitleValidator } from "@/utils/validators"
import Form from "@/web/components/ui/Form"
import FormField from "@/web/components/ui/FormField"
import { Formik } from "formik"
import { object } from "yup"
import { useSession } from "@/web/components/SessionContext"
import apiClient from "@/web/services/apiClient"
import { useRouter } from "next/router"

export const getServerSideProps = async ({ params: { postId } }) => {
  const post = await apiClient(`/posts/${postId}`)

  return {
    props: {
      initTitle: post?.title,
      initContent: post?.content,
      postId,
    },
  }
}
const validationSchema = object({
  title: postTitleValidator.label("Title"),
  content: postContentValidator.label("Content"),
})
const CreateTodoPage = ({ initTitle, initContent, postId }) => {
  const initialValues = {
    title: initTitle,
    content: initContent,
  }
  const router = useRouter()
  const { session } = useSession()
  const handleSubmit = async (values) => {
    await apiClient.patch(`/posts/${postId}`, values)
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
          Edit
        </button>
      </Form>
    </Formik>
  ) : (
    <p>FORBIDDEN</p>
  )
}

export default CreateTodoPage
