import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: [
        {
          _id: {
            type: mongoose.Schema.ObjectId,
            default: mongoose.Types.ObjectId,
          },
          username: {
            type: String,
            default: "",
          },
          avatar: {
            type: String,
            default: "",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    // incomingFriendRequests: {
    //   type: [String],
    //   default: [],
    // },
    // sentFriendRequests: {
    //   type: [String],
    //   default: [],
    // },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
