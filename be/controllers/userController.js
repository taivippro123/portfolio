import User from "../models/UserModel.js";
import {comparePassword, generateToken, hashPassword, verifyToken} from "../middleware/auth.js";
export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Tên đăng nhập và mật khẩu là bắt buộc" });
    }
    
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log('Create User Error:', error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }
    const token = generateToken({ id: user._id });
    res.header('Authorization', `Bearer ${token}`);
    res.status(200).json({ token, message: "Đăng nhập thành công" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log('Login Error:', error);
  }
};

export const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Đăng xuất thành công" })
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log('Logout Error:', error);
    }
};

export const verifyUser = async (req, res) => {
    try {
        // Token đã được verify trong middleware, req.user đã có thông tin
        res.status(200).json({ message: "Token hợp lệ", user: req.user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log('Verify Error:', error);
    }
};
