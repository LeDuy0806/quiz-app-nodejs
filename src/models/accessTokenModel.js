import mongoose from "mongoose";

const AccessTokenSchema = new moogoose.Schema(
  {
    user_id: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    token: { type: String, unique: true },
  },

  {
    timestamps: true,
  }
);

const AccessToken = mongoose.model("access_tokens", AccessTokenSchema);
export default AccessToken;
