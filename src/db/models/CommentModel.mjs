import BaseModel from "@/db/models/BaseModel.mjs"
import UserModel from "./UserModel.mjs"

class CommentModel extends BaseModel {
  static tableName = "comments"
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        filter: (query) => query.select("id", "username"),
        join: {
          from: "comments.authorId",
          to: "users.id",
        },
      },
    }
  }
}

export default CommentModel
