import BaseModel from "@/db/models/BaseModel.mjs"
import UserModel from "./UserModel.mjs"

class PostModel extends BaseModel {
  static tableName = "posts"
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        filter: (query) => query.select("id", "username", "isAdmin"),
        join: {
          from: "posts.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default PostModel
