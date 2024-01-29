const CommentsList = ({ post }) => (
  <div>
    <table className="w-full">
      <thead></thead>
      <tbody>
        {post.comments.map(({ id, content, user: { username } }) => (
          <tr key={id} className="even:bg-slate-100">
            <td className="p-4">{username}</td>
            <td className="p-4">{content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default CommentsList
