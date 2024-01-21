import { formatDateTimeShort } from "@/utils/formatters"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/posts", { params: { page } })

  return {
    props: {
      initialData: data,
    },
  }
}
// eslint-disable-next-line max-lines-per-function
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
  })
  const handleClickEdit = (id) => {
    router.push(`/posts/edit/${id}`)
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {["#", "Title", "Author", "Created At", "Edit"].map((label) => (
              <td
                key={label}
                className="p-4 bg-slate-300 text-center font-semibold"
              >
                {label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map(
            ({ id, title, createdAt, user: { username, id: userId } }) => (
              <tr key={id} className="even:bg-slate-100">
                <td className="p-4">{id}</td>
                <td className="p-4">
                  <a className="text-blue-400" href={`/posts/${id}`}>
                    {title}
                  </a>
                </td>
                <td className="p-4">{username}</td>
                <td className="p-4">
                  {formatDateTimeShort(new Date(createdAt))}
                </td>
                <td className="p-4">
                  {parseInt(session?.id, 10) === userId ? (
                    <button onClick={() => handleClickEdit(id)}>Edit</button>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default IndexPage
