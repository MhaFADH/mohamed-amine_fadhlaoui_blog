/* eslint-disable max-lines-per-function */
import Pagination from "@/web/components/ui/Pagination"
import { formatDateTimeShort } from "@/utils/formatters"

const PostsList = ({ posts, count, page, handleClickEdit, session }) => (
  <div>
    <table className="w-full">
      <thead>
        <tr>
          {["#", "Title", "Author", "Created At", "Views", "Edit"].map(
            (label) => (
              <td
                key={label}
                className="p-4 bg-slate-300 text-center font-semibold"
              >
                {label}
              </td>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {posts.map(
          ({
            id,
            title,
            createdAt,
            visits,
            user: { username, id: userId },
          }) => (
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
              <td className="p-4">{visits}</td>
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

export default PostsList
