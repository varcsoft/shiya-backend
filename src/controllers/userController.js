import { sanitize } from "../config/sanitize.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../services/userService.js";
import response from "../config/response.js";
import { comparePassword, hashPassword } from "../config/sec.js";
import { getOrdersByUserId } from "../services/orderService.js";
import {
  deleteAddressByIdAndUserId,
  getAddressByIdAndUserId,
  getAddressByUserId,
  insertAddress,
  updateAddressByIdAndUserId,
} from "../services/addressService.js";

const getAllUsersC = async (req, res) => {
  try {
    const users = await getAllUsers();
    return response.sendSuccess(res, 200, "All users", users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    return response.sendError(res, 500, 999);
  }
};
const getUserC = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return response.sendError(res, 400, 1002);
    }
    return response.sendSuccess(res, 200, "User", user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return response.sendError(res, 500, 999);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return response.sendError(res, 400, 1002);
    }
    let sanitizedUser = sanitize(user);

    return response.sendSuccess(res, 200, "User profile", {
      ...sanitizedUser,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return response.sendError(res, 500, 1003);
  }
};

// this should check the user profile link with firebase and google signin and github and if not in our db and available in firebase then link in our db as well

const updateProfile = async (req, res) => {
  try {
    // console.log(req.body);
    delete req.body.iat;
    delete req.body.exp;
    delete req.body.id;
    // console.log("req.body", req.body);
    const user = await updateUser(req.user.id, req.body);
    let sanitizedUser = sanitize(user);
    return response.sendSuccess(res, 200, "User profile updated", {
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return response.sendError(res, 500, 1003);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (newPassword == oldPassword) {
      return response.sendError(res, 400, 1104);
    }
    let isPasswordValid = false;
    if (oldPassword && oldPassword.length > 0) {
      isPasswordValid = await comparePassword(oldPassword, req.user.password);
      if (isPasswordValid) {
        // set new password
        const user = await updateUser(req.user.id, {
          password: await hashPassword(newPassword),
        });
        let sanitizedUser = sanitize(user);
        return response.sendSuccess(res, 200, "User password updated", {
          user: sanitizedUser,
        });
      } else {
        return response.sendError(res, 400, 1106);
      }
    }
    const user = await updateUser(req.user.id, {
      password: await hashPassword(newPassword),
    });
    let sanitizedUser = sanitize(user);
    return response.sendSuccess(res, 200, "User password updated", {
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Error updating user password:", error);
    return response.sendError(res, 500, 1003);
  }
};

const checkPassword = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return response.sendError(res, 400, 1002);
    }
    const hasPassword = (await user.password) != null;

    response.sendSuccess(res, 200, "Password checked", {
      hasPassword: hasPassword,
    });
  } catch (error) {
    console.error("Error checking user password:", error);
    return response.sendError(res, 500, 1003);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    if (!orders) {
      return response.sendError(res, 400, 1002);
    }
    return response.sendSuccess(res, 200, "Orders retrieved", orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return response.sendError(res, 500, 1003);
  }
};
const addAddress = async (req, res) => {
  try {
    const address = req.body;
    const userId = req.user.id;
    const newAddress = await insertAddress(userId, address);
    return response.sendSuccess(res, 200, "Address added", newAddress);
  } catch (error) {
    console.error("Error adding user address:", error);
    return response.sendError(res, 500, 999);
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await getAddressByUserId(userId);
    if (!addresses) {
      return response.sendError(res, 400, 1002);
    }
    return response.sendSuccess(res, 200, "Addresses retrieved", addresses);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return response.sendError(res, 500, 1003);
  }
};
const getAddressByIdC = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const addresses = await getAddressByIdAndUserId(addressId, userId);
    if (!addresses) {
      return response.sendError(res, 400, 1011);
    }
    return response.sendSuccess(res, 200, "Addresses retrieved", addresses);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return response.sendError(res, 500, 999);
  }
};
const updateAddressByIdC = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const addressExist = await getAddressByIdAndUserId(addressId, userId);
    if (!addressExist) {
      return response.sendError(res, 400, 1011);
    }
    const addresses = await updateAddressByIdAndUserId(
      addressId,
      userId,
      req.body,
    );
    if (!addresses) {
      return response.sendError(res, 400, 1011);
    }
    return response.sendSuccess(res, 200, "Address updated", addresses);
  } catch (error) {
    console.error("Error updating user addresses:", error);
    return response.sendError(res, 500, 999);
  }
};

const deleteAddressByIdC = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const addressExist = await getAddressByIdAndUserId(addressId, userId);
    if (!addressExist) {
      return response.sendError(res, 400, 1011);
    }
    const addresses = await deleteAddressByIdAndUserId(addressId, userId);
    if (!addresses) {
      return response.sendError(res, 400, 1011);
    }
    return response.sendSuccess(res, 200, "Address deleted", addresses);
  } catch (error) {
    console.error("Error deleting user addresses:", error);
    return response.sendError(res, 500, 999);
  }
};

export default {
  getAllUsersC,
  getUserC,
  getProfile,
  updateProfile,
  updatePassword,
  checkPassword,
  getOrders,
  addAddress,
  getAddresses,
  getAddressByIdC,
  updateAddressByIdC,
  deleteAddressByIdC,
};
