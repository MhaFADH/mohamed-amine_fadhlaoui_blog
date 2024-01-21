import config from "@/config.mjs"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const getServerSideProps = async ({ query: { page }, req }) => {
  const data = await apiClient("/users", {
    params: { page },
    headers: {
      cookie: req.cookies[config.security.jwt.cookieName],
    },
  })

  return {
    props: { initialData: data },
  }
}
// eslint-disable-next-line max-lines-per-function
const UsersList = ({ initialData }) => {
  const { query } = useRouter()
  const router = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    isRefetching,
    data: {
      result: users,
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () =>
      apiClient("/users", {
        params: { page },
      }),
    initialData,
    enabled: false,
  })
  const { mutateAsync: deleteUser } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (userId) => apiClient.delete(`/users/${userId}`),
    onSuccess: () => {
      refetch()
    },
  })
  const { mutateAsync: modifdyUser } = useMutation({
    mutationFn: ({ userId, modify }) =>
      apiClient.patch(`/users/${userId}`, modify),
    onSuccess: () => {
      refetch()
    },
  })
  const handleClickDelete = async (event) => {
    const userId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    await deleteUser(userId)
  }
  const handleClickPrivileges = async (event) => {
    const userId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    const user = users.find((ele) => ele.id === userId)
    await modifdyUser({ userId, modify: { isAdmin: !user.isAdmin } })
  }
  const handleClickSChangeState = async (event) => {
    const userId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    const user = users.find((ele) => ele.id === userId)
    await modifdyUser({ userId, modify: { enabled: !user.enabled } })
  }
  const handleClickEdit = (event) => {
    const userId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    router.push(`/edit-profile/${userId}`)
  }

  return (
    <div className="relative">
      {isFetching || (isRefetching && <Loader />)}
      <table className="w-full">
        <thead>
          <tr>
            {[
              "id",
              "Username",
              "Active",
              "Admin",
              "PRIVILEGES",
              "DISABLE/ENABLE",
              "EDIT",
              "DELETE",
            ].map((label) => (
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
          {users.map(({ id, username, isAdmin, enabled }, index) => (
            <tr key={id} className="even:bg-slate-100">
              <td className="p-4">{id}</td>
              <td className="p-4">{username}</td>
              <td className="p-4">{enabled.toString()}</td>
              <td className="p-4">{isAdmin.toString()}</td>
              <td className="p-4">
                <button
                  data-id={id}
                  data-index={index}
                  onClick={handleClickPrivileges}
                >
                  Toggle
                </button>
              </td>
              <td className="p-4">
                <button
                  data-id={id}
                  data-index={index}
                  onClick={handleClickSChangeState}
                >
                  Toggle
                </button>
              </td>
              <td className="p-4">
                <button data-id={id} onClick={handleClickEdit}>
                  Edit
                </button>
              </td>
              <td className="p-4">
                <button data-id={id} onClick={handleClickDelete}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default UsersList
