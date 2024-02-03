import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { idValidator } from "@/utils/validators"

const handle = mw({
  PATCH: [
    validate({
      query: {
        postId: idValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        query: { postId },
      },
      res,
    }) => {
      await PostModel.query()
        .increment("visits", 1)
        .where("id", "=", postId)
        .throwIfNotFound()

      res.send("Post visits updated")
    },
  ],
})

export default handle
