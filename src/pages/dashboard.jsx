import Loader from "@/web/components/ui/Loader"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"
import config from "@/config.mjs"
import PostsList from "@/web/components/ui/PostsList"
import { useEffect } from "react"

export const getServerSideProps = async ({ query: { page }, req }) => {
  const data = await apiClient("/dashboard", {
    params: { page },
    headers: {
      cookie: req.cookies[config.security.jwt.cookieName],
    },
  })

  return {
    props: { initialData: data },
  }
}
const DashBoardPage = ({ initialData }) => {
  const { query } = useRouter()
  const router = useRouter()
  const { session } = useSession()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    data: {
      result: { posts, countCom, countPost },
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["postsDashboard", page],
    queryFn: () => apiClient("/dashboard", { params: { page } }),
    initialData,
    enabled: false,
  })
  const handleClickEdit = (id) => {
    router.push(`/posts/edit/${id}`)
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <div>
        <p>comments number: {countCom}</p>
        <p>posts number: {countPost}</p>
      </div>
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

export default DashBoardPage
