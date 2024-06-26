import Loader from "@/web/components/ui/Loader"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"
import PostsList from "@/web/components/ui/PostsList"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/posts", { params: { page } })

  return {
    props: {
      initialData: data,
    },
  }
}
const IndexPage = ({ initialData }) => {
  const { query } = useRouter()
  const router = useRouter()
  const { session } = useSession()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    data: {
      result: posts,
      meta: { count },
    },
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => apiClient("/posts", { params: { page } }),
    initialData,
    enabled: false,
  })
  const handleClickEdit = (id) => {
    router.push(`/posts/edit/${id}`)
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}

      {posts && (
        <PostsList
          count={count}
          page={page}
          session={session}
          posts={posts}
          handleClickEdit={handleClickEdit}
        />
      )}
    </div>
  )
}

export default IndexPage
