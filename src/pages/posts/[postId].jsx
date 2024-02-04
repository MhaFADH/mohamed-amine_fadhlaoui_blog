/* eslint-disable max-lines-per-function */
import { useQuery } from "@tanstack/react-query"
import apiClient from "@/web/services/apiClient"
import Loader from "@/web/components/ui/Loader"
import { useSession } from "@/web/components/SessionContext"
import { Form, Formik } from "formik"
import FormField from "@/web/components/ui/FormField"
import { commentValidator } from "@/utils/validators"
import { object } from "yup"
import { useRouter } from "next/router"
import CommentsList from "@/web/components/ui/CommentsList"

export const getServerSideProps = async ({ params: { postId } }) => {
  await apiClient.patch(`posts/visits-update/${postId}`)
  const post = await apiClient(`/posts/${postId}`)

  return {
    props: {
      initialData: post,
      postId,
    },
  }
}
const validationSchema = object({
  comment: commentValidator.label("Comment"),
})
const PostPage = ({ initialData, postId }) => {
  const router = useRouter()
  const { session } = useSession()
  const {
    isFetching,
    data: post,
    refetch,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => apiClient(`/posts/${postId}`),
    initialData,
    cacheTime: 0,
    enabled: false,
  })
  const handleSubmit = async (values) => {
    if (!session || !values.comment) {
      return
    }

    const body = {
      authorId: session.id,
      postId,
      content: values.comment,
    }
    await apiClient.post("/comments", body)
    await refetch()
  }
  const handleClickEdit = () => {
    router.push(`/posts/edit/${postId}`)
  }

  return (
    <div className="flex flex-row bg-slate-100">
      {isFetching && <Loader />}
      <div className=" basis-2/3 text-center  py-3.5 ">
        {parseInt(session?.id, 10) === post.user.id && (
          <button className="bg-slate-300 p-2" onClick={handleClickEdit}>
            Edit
          </button>
        )}
        <p className="py-4 text-4xl">{post.title}</p>
        <p className="py-36 text-2xl">{post.content}</p>
      </div>
      <div className=" basis-1/3 text-center">
        <Formik
          initialValues={{ comment: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex items -center">
            <FormField name="comment" placeholder="Leave a comment" />
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-slate-300 p-2"
            >
              SEND
            </button>
          </Form>
        </Formik>
        <div>
          <CommentsList post={post} />
        </div>
      </div>
    </div>
  )
}

export default PostPage
