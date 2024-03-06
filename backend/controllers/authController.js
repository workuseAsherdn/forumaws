const bcrypt = require("bcrypt");
const user = require("../models/usermodel");
const verifyUser = require("../models/verifyUser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sendMail } = require("./SendMail");
const thread = require("../models/thread");
dotenv.config();
const verify = async (req, res) => {
  try {
    const {
      userName,
      lastName,
      userIdentity,
      email,
      password,
      passwordVerify,
    } = await req.body;
    if (!email || !password || !userName || !userIdentity)
      return res
        .status(400)
        .json({ errorMessage: "please enter all required feilds" });
    const existingUser = await user.findOne({ email });
    const existingId = await user.findOne({ userIdentity });
    if (existingId) {
      return res.status(200).send("User ID is Taken");
    }
    if (existingUser) {
      return res.status(200).send("User Already Exists");
    }
    if (password !== passwordVerify) {
      return res.status(200).send("password doesnt match");
    }
    if (password.length < 6) {
      return res
        .status(200)
        .send("please enter a password of atleast 6 charecters");
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(200)
        .send(
          "Password must contain at least one uppercase letter, one special character"
        );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new verifyUser({
      userName: userName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      profilePic: `https://cdn.iconscout.com/icon/free/png-256/free-user-2451533-2082543.png`,
      userIdentity: userIdentity,
    });
    const savedUser = await newUser.save();
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const content = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Registration OTP</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #333;
            }

            p {
                color: #666;
            }

            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
            }

            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                text-align: center;
                text-decoration: none;
                background-color: #007bff;
                color: #fff;
                border-radius: 5px;
            }

            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Account Registration OTP</h1>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Welcome to our platform! To complete your registration, please enter the One Time Password (OTP) below:</p>
            <p class="otp">${OTP}</p>
            <p>This OTP will expire in 5 minutes for security reasons.</p>
            <p>If you didn't request this registration or have any concerns, please ignore this email.</p>
            <br>
            <p>Best regards,<br>Team RevNitro<br><img src="https://yt3.googleusercontent.com/nGClMQ6Qk2JRF1UZ6__5dq9xZcht-p72rezZthIz1yH5wfbHDZwF2HwPMIOS2oucMxPozVfFrw=s900-c-k-c0x00ffffff-no-rj" alt="Revnitro logo" style="width:50px;height:50px;"</p>
        </div>
    </body>
    </html>
    `;
    sendMail(email, "OTP for Registeration", content);
    const token = jwt.sign(
      {
        OTP,
        userId: savedUser._id,
      },
      process.env.JWTSecret
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // Requires a secure (HTTPS) connection
      })
      .status(200)
      .send("Successful VerifyUser");
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errorMessage: "Internal Server Error",
    });
  }
};
const Register = async (req, res) => {
  try {
    const currentToken = req.cookies.token;
    const OTP = await req.body;
    if (!currentToken) {
      return res.send("no token");
    }

    jwt.verify(
      currentToken,
      process.env.JWTSecret,
      async (err, tokenDetails) => {
        if (err) {
          console.error("Token is not valid:", err.message);
          return res.send("TokenVerificationFailed");
        }
        try {
          const existingUser = await verifyUser.findOne({
            _id: tokenDetails.userId,
          });
          if (!existingUser) {
            console.error("User not found");
            return res.send("No User");
          }
          if (tokenDetails.OTP === OTP.OTP) {
            const newUser = new user({
              userName: existingUser.userName,
              lastName: existingUser.lastName,
              email: existingUser.email,
              password: existingUser.password,
              profilePic: existingUser.profilePic,
              userIdentity: existingUser.userIdentity,
            });
            const savedUser = await newUser.save();
            await existingUser.deleteOne({ _id: existingUser._id });
            const token = jwt.sign(
              {
                userId: savedUser._id,
              },
              process.env.JWTSecret
            );
            res
              .cookie("token", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true, // Requires a secure (HTTPS) connection
              })
              .status(200)
              .send("Successful Register");
          } else {
            console.error("incorrect otp");
            return res.send("incorrect otp");
          }
        } catch (error) {
          console.error("Error finding user:", error.message);
          return res.send("Token Verification Error");
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errorMessage: "Internal Server Error",
    });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("enter all the fieds");
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.send("NoUser");
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.send("NoUser");
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      process.env.JWTSecret
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // Requires a secure (HTTPS) connection
      })
      .status(200)
      .json({
        Success: "Successful Login",
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errorMessage: "Internal Server Error",
    });
  }
};
const Logout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      expires: new Date(0),
    })
    .json({
      Success: "Successful Logout",
    });
};
const LoggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.send(false);
    }
    jwt.verify(token, process.env.JWTSecret);
    res.send(true);
  } catch (err) {
    console.error(err);
    return res.send(false);
  }
};
const updateProfile = async (req, res) => {
  try {
    const updatableData = req.body; // No need to use "await" here
    const { userId, newProfilePic, newUserName, newLastName, newUserIdentity } =
      updatableData;

    // Update user profile pic
    const oldDetails = await user.findById({ _id: userId });
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        profilePic: newProfilePic,
        userName: newUserName,
        lastName: newLastName,
        userIdentity: newUserIdentity,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send(false); // User not found
    }
    const updatableUser = await user.findById({ _id: userId });
    // Update profile pic for threads where the author matches the user
    const updatedThreads = await thread.updateMany(
      { author: oldDetails.userName },
      {
        $set: {
          authorProfilePic: newProfilePic,
          author: newUserName,
          authorIdentity: newUserIdentity,
        },
      },
      { new: true }
    );
    const updatedComments = await thread.updateMany(
      { "comments.commenterIdentity": oldDetails.userIdentity },
      {
        $set: {
          "comments.$[comment].commenterProfilePic": newProfilePic,
          "comments.$[comment].commenterName": newUserName,
          "comments.$[comment].commenterIdentity": newUserIdentity,
        },
      },
      {
        arrayFilters: [
          { "comment.commenterIdentity": oldDetails.userIdentity },
        ],
      },
      { new: true }
    );
    return res.status(200).send(true);
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).send("Internal Server Error");
  }
};
const User = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.send(false);
    }
    jwt.verify(token, process.env.JWTSecret, async (err, tokenDetails) => {
      if (err) {
        console.error("Token is not valid:", err.message);
        return res.send(false);
      }
      try {
        const User = await user.findOne({ _id: tokenDetails.userId });
        if (!User) {
          console.error("User not found");
          return res.send(false);
        }
        const unreadNotifications = User.notifications.filter(
          (notification) => !notification.isRead
        );
        const notification = User.notifications;
        const sendDetails = {
          userId: User._id,
          userName: User.userName,
          lastName: User.lastName,
          userIdentity: User.userIdentity,
          isAdmin: User.isAdmin,
          profilePic: User.profilePic,
          notifications: notification,
          unreadNotifications: unreadNotifications.length,
          email: User.email,
        };
        res.send(sendDetails);
      } catch (error) {
        console.error("Error finding user:", error.message);
        return res.send(false);
      }
    });
  } catch (err) {
    console.error(err);
    return res.send(false);
  }
};
const FindIdentity = async (req, res) => {
  try {
    const updatableData = req.body; // No need to use "await" here
    const { userIdentity } = updatableData;
    const User = await user.findOne({ userIdentity: userIdentity });
    if (User) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  } catch (err) {
    console.error(err);
    return res.send("server Issue");
  }
};
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await user.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).send("User Not Available");
    }
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const content = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #666;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #007bff;
            color: #fff;
            border-radius: 5px;
        }

        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello <strong>${existingUser.userName}</strong>,</p>
        <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, enter the One Time Password(OTP) given below in the Otp Box,
        <h2><strong><center><p>${OTP}</p><center></strong></h2>
        <p>This link will expire in 1 hour.</p>
        <p>Thank you,<br>TeamRevnitro<br><img src="https://yt3.googleusercontent.com/nGClMQ6Qk2JRF1UZ6__5dq9xZcht-p72rezZthIz1yH5wfbHDZwF2HwPMIOS2oucMxPozVfFrw=s900-c-k-c0x00ffffff-no-rj" alt="Revnitro logo" style="width:50px;height:50px;"</p>
    </div>
</body>

</html>
    `;
    sendMail(email, "Password Reset", content);
    const token = jwt.sign(
      {
        email,
        OTP,
      },
      process.env.JWTSecret
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,

        expires: new Date(Date.now() + 60 * 60 * 1000),
      })
      .status(200)
      .send("success");
  } catch (error) {
    console.error(error);
    res.status(500).send("processFailed");
  }
};
const passwordChange = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { newPassword, confirmPassword, OTP } = req.body;
    if (newPassword !== confirmPassword) {
      return res.send("Passwords do not match");
    }
    if (!token) {
      return res.send("no token");
    }
    jwt.verify(token, process.env.JWTSecret, async (err, tokenDetails) => {
      if (err) {
        console.error("Token is not valid:", err.message);
        return res.send("TokenVerificationFailed");
      }

      try {
        const User = await user.findOne({ email: tokenDetails.email });
        if (!User) {
          console.error("User not found");
          return res.send("No User");
        }
        const tokenOTP = tokenDetails.OTP;
        if (tokenDetails.OTP === OTP) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          await user.findOneAndUpdate(
            { email: tokenDetails.email },
            { $set: { password: hashedPassword } },
            { new: true }
          );
          return res
            .cookie("token", "", {
              httpOnly: true,
              expires: new Date(0),
            })
            .send("success");
        } else {
          console.error("incorrect otp");
          return res.send("incorrect otp");
        }
      } catch (error) {
        console.error("Error finding user:", error.message);
        return res.send("Token Verification Error");
      }
    });
  } catch (err) {
    console.error(err);
    return res.send("Some Internal Error");
  }
};

module.exports = {
  verify,
  Register,
  Login,
  User,
  Logout,
  LoggedIn,
  updateProfile,
  ForgotPassword,
  passwordChange,
  FindIdentity,
};
