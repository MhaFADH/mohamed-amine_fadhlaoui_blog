import { formatDateTimeShort } from "@/utils/formatters"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useSession } from "@/web/components/SessionContext"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/todos", { params: { page } })

  return {
    props: { initialData: data },
  }
}
// eslint-disable-next-line max-lines-per-function
const IndexPage = ({ initialData }) => {
  const { query } = useRouter()
  const { session } = useSession()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    data: {
      result: todos,
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["todos", page],
    queryFn: () => apiClient("/todos", { params: { page } }),
    initialData,
    enabled: false,
  })
  const { mutateAsync: toggleTodo } = useMutation({
    mutationFn: (todo) =>
      apiClient.patch(`/todos/${todo.id}`, {
        isDone: !todo.isDone,
      }),
  })
  const { mutateAsync: deleteTodo } = useMutation({
    mutationFn: (todoId) => apiClient.delete(`/todos/${todoId}`),
  })
  const handleClickToggle = (id) => async () => {
    const todo = todos.find(({ id: todoId }) => todoId === id)
    await toggleTodo(todo)
    await refetch()
  }
  const handleClickDelete = async (event) => {
    const todoId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    await deleteTodo(todoId)
    await refetch()
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {[
              "#",
              "Description",
              "Done",
              "Category",
              "Created At",
              "",
              "🗑️",
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
          {todos.map(
            ({ id, description, isDone, createdAt, category: { name } }) => (
              <tr key={id} className="even:bg-slate-100">
                <td className="p-4">{id}</td>
                <td className="p-4">{description}</td>
                <td className="p-4">{isDone ? "✅" : "❌"}</td>
                <td className="p-4">{name}</td>
                <td className="p-4">
                  {formatDateTimeShort(new Date(createdAt))}
                </td>
                <td className="p-4">
                  {session ? (
                    <button onClick={handleClickToggle(id)}>Toggle</button>
                  ) : (
                    <></>
                  )}
                </td>
                <td className="p-4">
                  {session ? (
                    <button data-id={id} onClick={handleClickDelete}>
                      Delete
                    </button>
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
