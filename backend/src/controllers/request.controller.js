import Request from "../models/request.model.js";

export const getAllSentRequestsController = async (req, res, next) => {
  // gets all friend requests
  try {
    const user = req.user;
    if (!user) {
      throw new AppError(404, "User not found");
    }
    const requests = await Request.find({ sourceId: user._id });
    if (!requests) {
      throw new AppError(404, "Friend requests not found");
    }
    res.status(200).json(requests);
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};
