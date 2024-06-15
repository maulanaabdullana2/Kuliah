const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/UserModels");
const imagekit = require("../lib/imagekit");
const Suppliers = require("../models/BarangModels");
const POorder = require("../models/InModels");;

const login = async (req, res, next) => {
  let { username, password } = req.body;
   username = username.trim();
   password = password.trim();
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new ApiError("Username not registered", 404));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new ApiError("Incorrect password", 400));

    const payload = {
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "aaaaaa", {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESHTOKEN_SECRET || "aaaaaa",
      {
        expiresIn: "1m",
      },
    );

    user.refreshToken = refreshToken;
    await user.save();
    const data = {
      _id: user._id,
      accessToken: accessToken,
    };
    res.cookie("refreshToken", refreshToken);
    res.status(200).json({
      status: "Success",
      message: "Login successful",
      data,
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const currentuser = async (req, res, next) => {
  try {
    const data = {
      _id: req.user._id,
      name: req.user.name,
      jabatan:req.user.jabatan,
      lokasi:req.user.lokasi,
      imageUrl: req.user.imageUrl,
    };

    res.status(200).json({
      status: "Success",
      data: {
        user: data,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "User ID retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const addUser = async (req, res, next) => {
  let { username, password, name, role, lokasi, jabatan } = req.body;
  username = username.toLowerCase();
  try {
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new ApiError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      role,
      lokasi,
      jabatan,
    });

    await newUser.save();

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      data: {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        role: newUser.role,
        lokasi: newUser.lokasi,
        jabatan: newUser.jabatan, // Returning jabatan in response
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return next(new ApiError("No users found", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "All users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
   const suppliers = await Suppliers.find({ userid: id });
   for (const sup of suppliers) {
    const updateuser = await Suppliers.findByIdAndUpdate(sup._id,{userid:null},{new:true})
   }
  const PoByUser = await POorder.find({ userid : id});
   for (const pobyusr of PoByUser) {
    const updateiduser = await POorder.findOneAndUpdate({userid : pobyusr?.userid}, {
      userid : null
    }, {new : true});
   }

   const DeleteUser = await User.findByIdAndDelete(id);


    res.status(200).json({
      status: "Success",
      message: "User deleted successfully",
      data : DeleteUser
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const updateUser = async (req, res, next) => {
  const { name, oldpassword, newpassword, lokasi, jabatan } = req.body; // Extracting jabatan from req.body
  try {
    const userId = req.user._id;

    let user = await User.findById(userId);

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    if (name) {
      user.name = name;
    }

    if (oldpassword && newpassword) {
      const match = await bcrypt.compare(oldpassword, user.password);
      if (!match) {
        return next(new ApiError("Incorrect old password", 400));
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;
    }

    if (lokasi) {
      user.lokasi = lokasi;
    }

    if (jabatan) {
      user.jabatan = jabatan; // Updating jabatan field
    }

    const file = req.file;

    if (file) {
      const img = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      user.imageUrl = img.url;
    }

    await user.save();

    res.status(200).json({
      status: "Success",
      message: "User updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        imageUrl: user.imageUrl,
        lokasi: user.lokasi,
        jabatan: user.jabatan,
      },
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

module.exports = {
  login,
  currentuser,
  getUserById,
  addUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
