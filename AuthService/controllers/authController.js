const User = require("../models/userModel");
const Tokens = require("../models/tokensModel");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  const { login, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Пользователь с таким логином уже существует");
  }

  const user = await User.create({
    login,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      login: user.login,
    });
  } else {
    res.status(400);
    throw new Error("Не удалось создать нового пользователя");
  }
}

async function authUser(req, res) {
  const { login, password } = req.body;

  const user = await User.findOne({ login });
  let tokens = await Tokens.find();

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  if (!tokens) {
    tokens = await Tokens.create({
      tokens: [refreshToken],
    });
  } else {
    await Tokens.findByIdAndUpdate(tokens._id, {
      $push: {
        tokens: refreshToken,
      },
    });
  }

  if (user && user.matchPassword(password)) {
    res.status(202).json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(401);
    throw new Error("Не правильный логин или пароль");
  }
}

async function refreshToken(req, res) {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.status(401);
    }

    const tokens = await Tokens.find({}).tokens;

    if (!tokens.includes(refreshToken)) {
        return res.status(403);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403);
        }
            const accessToken = generateAccessToken({ login: user.login });
            res.json({
                accessToken,
            });
        }
    );
}

async function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2m" });
}

module.exports = {
  createUser,
  authUser,
  refreshToken,
};
