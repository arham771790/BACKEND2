import { asyncHandler } from "..utils/asyncHandler";
// Just registering a user
export const registerUser = (req, res) => {
    res.status(200).json({ message: "OK" });
};
