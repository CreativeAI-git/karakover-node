const {
  addUser,
  fetchUserByEmail,
  fetchUser,
  updateUserbyPass,
  fetchUserbysocial,
  updateUsersocail,
  fetchUserList,
  fetchUserById,
  updateUserById,
  fetchUserToken,
  updateVerifyUser,
  fetchArtistSongsById,
  updateUser,
  updPasswdByToken,
  tokenUpdate,
  fetchUserActToken,
  updateLoginStatusByEmail,
  getSongsOfArtist,
  verifyUser,
  verifyPassword,
  updatePassword,
  fetchInstrumentUserid,
  fetchSongsByGenreId,
  insertSongRequest,
  insertIntoNotification,
  get_notification,
  update_fcm_token,
  fetchPaymentByUserId
} = require("../models/users");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const moment = require("moment");
const path = require("path");

var crypto = require("crypto");
var base64url = require("base64url");
const localStorage = require("localStorage");

/** Sync */
function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

function betweenRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  // secure: true,
  auth: {
    user: "karaokeapp23@gmail.com",
    pass: "itkfbulkhkrnbvrc",
  },
});

exports.signup = async (req, res) => {
  try {
    var CurrentDate = moment().format();
    const { email, firstname, lastname, password, phone } = req.body;
    const actToken = betweenRandomNumber(10000000, 99999999);
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string()
          .min(5)
          .max(255)
          .email({ tlds: { allow: false } })
          .lowercase()
          .required(),
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        firstname: Joi.string().empty().required().messages({
          "string.empty": "can't be empty",
          "string.required": "firstname is required",
        }),
        lastname: Joi.string().empty().required().messages({
          "string.empty": "lastname can't be empty",
          "string.required": "lastname is required",
        }),
        phone: [
          Joi.number().empty().required(),
          Joi.string().empty().required(),
        ],
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result = await fetchUserByEmail(email);
      if (result.length === 0) {
        bcrypt.genSalt(saltRounds, async function (err, salt) {
          bcrypt.hash(password, salt, async function (err, hash) {
            if (err) throw err;

            let user = {
              email: email,
              password: hash,
              firstname: firstname,
              lastname: lastname,
              phone: phone,
              act_token: actToken,
              created_at: CurrentDate,
            };
            const result = await addUser(user);

            if (result.affectedRows > 0) {
              let mailOptions = {
                from: "karaokeapp23@gmail.com",
                to: email,
                subject: "Activate Account",
                html: `<table width="100%" border=false cellspacing=false cellpadding=false>
                                <tr>
                                   <td class="bodycopy" style="text-align:left;">
                                      <center>
                                         <div align="center"></div>
                                         <p></p>
                                         <h2 style="text-align: center;margin-top:15px;"><strong>Your account has been created successfully and is ready to use </strong></h2>
                                         <p style="color:#333"> Please <a href="https://159.223.251.167:3000/verifyhomeUser/${actToken}/${result.insertId}">click here</a>  to activate your account.</p>
                                      </center>
                                   </td>
                                </tr>
                             </table>`,
              };

              transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                  return res.json({
                    success: false,
                    message: "Mail Not delivered",
                  });
                } else {
                  const result = await fetchUserByEmail(email);

                  //fetch user details
                  if (result[0]["image"] != "") {
                    profileImage =
                      "https://159.223.251.167:3000/uploads/" +
                      result[0]["image"];
                    // "https://159.223.251.167:3000/uploads/" +
                    // result[0]["image"];
                  } else {
                    profileImage = "";
                  }

                  let userdetail = {
                    id: result[0]["id"],
                    firstname: result[0]["firstname"],
                    lastname: result[0]["lastname"],
                    email: result[0]["email"],
                    phone: result[0]["phone"],
                    image: profileImage,
                  };

                  return res.json({
                    success: true,
                    status: 200,
                    message:
                      "Thank you, You will receive an e-mail in the next 5 minutes with instructions for resetting your password. If you Don't receive this e-mail, please check your junk mail folder or contact us for further assistance.",
                    userinfo: userdetail,
                  });
                }
              });
            } else {
              return res.json({
                message: "user failed to register",
                status: 400,
                success: false,
                userinfo: [],
              });
            }
          });
        });
      } else {
        return res.json({
          success: false,
          message: "Already Exists",
          status: 400,
          userInfo: [],
        });
      }
    }
  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, fcm_token } = req.body;

    // Validation
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string()
          .min(5)
          .max(255)
          .email({ tlds: { allow: false } })
          .lowercase()
          .required(),
        password: Joi.string().min(5).max(20).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        fcm_token: Joi.string().empty(),
      })
    );

    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }

    // Fetch user
    const userResult = await fetchUserByEmail(email);

    if (userResult.length === 0) {
      return res.json({
        message: "User not found",
        status: 400,
        success: false,
      });
    }

    const user = userResult[0];

    // Block soft-deleted users
    const isDeleted =
      user.is_deleted == 1 ||
      (user.deleted_at && user.deleted_at !== "0000-00-00 00:00:00");
    if (isDeleted) {
      return res.json({
        message: "Account has been deleted. Please contact support.",
        success: false,
        status: 403,
      });
    }

    // Check password
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.json({
        message: "Wrong password",
        success: false,
        status: 400,
      });
    }

    // Check account verification
    if (user.act_token !== "") {
      return res.json({
        message: "Please verify your account first",
        success: false,
        status: 400,
        token: "",
        userinfo: [],
      });
    }

    // Update login status
    await updateLoginStatusByEmail(email);

    // JWT token
    const token = jwt.sign(
      { data: { id: user.id } },
      "SecretKey"
    );

    // Update FCM token
    await update_fcm_token(fcm_token, email);

    // Profile image
    let profileImage = "";
    if (user.image && user.image !== "") {
      profileImage = "https://159.223.251.167:3000/uploads/" + user.image;
    }
    user.image = profileImage;

    // Fetch selected instrument
    const instrument = await fetchInstrumentUserid(user.id);
    user.instrument_selected = instrument.length > 0 ? instrument[0].instrument_selected : "";

    // **Fetch payment status**
    const paymentData = await fetchPaymentByUserId(user.id); // you need to implement this function
    console.log('paymentData', paymentData);
    user.payment_done = paymentData && paymentData.payment_status === 1 ? true : false;

    return res.json({
      success: true,
      message: "Successfully Login",
      status: 200,
      token: token,
      userinfo: user,
    });
  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};



exports.verifyUser = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).send("Invalid link");
    } else {
      const result = await fetchUserToken(token);

      if (result.rowCount != 0) {
        //const resultUpdate = await updVerifyUser(token);

        if (resultUpdate.rowCount) {
          res.render(path.join(__dirname + "/view/verify.ejs"), { msg: "" });
        } else {
          return res.json({
            message: "User update failed ",
            status: 400,
            success: false,
          });
        }
      } else {
        res.render(path.join(__dirname + "/view/notverify.ejs"), {
          msg: "Your verification token has Expired",
        });
      }
    }
  } catch (err) {
    res.render(path.join(__dirname + "/view/notverify.ejs"), {
      msg: "Something went wrong!",
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { email, firstname, lastname, phone, user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.number().empty(), Joi.string().empty()],
        firstname: [Joi.number().empty(), Joi.string().empty()],
        lastname: [Joi.number().empty(), Joi.string().empty()],
        phone: [
          Joi.number().optional().allow(""),
          Joi.string().optional().allow(""),
        ],
        user_id: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate({
      email,
      firstname,
      lastname,
      phone,
      user_id,
    });

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let filename = "";
      if (req.file) {
        const file = req.file;
        filename = file.filename;
      }

      const userInfo = await fetchUserById(user_id);
      if (userInfo.length !== 0) {
        let user = {
          email: email ? email : userInfo[0].email,
          firstname: firstname ? firstname : userInfo[0].firstname,
          lastname: lastname ? lastname : userInfo[0].lastname,
          phone: phone ? phone : userInfo[0].phone,
          image: filename ? filename : userInfo[0].image,
        };
        const result = await updateUserById(user, user_id);
        if (result.affectedRows) {
          return res.json({
            message: "update user successfully",
            status: 200,
            success: true,
          });
        } else {
          return res.json({
            message: "update user failed ",
            status: 400,
            success: false,
          });
        }
      } else {
        return res.json({
          messgae: "data not found",
          status: 400,
          success: false,
        });
      }
    }
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string().empty().required().messages({
          "string.empty": "email can't be empty",
          "string.required": "email is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result = await fetchUserByEmail(email);

      if (result.length != 0) {
        const genToken = randomStringAsBase64Url(20);
        await updateUser(genToken, email);

        const result = await fetchUserByEmail(email);

        let token = result[0].token;
        let mailOptions = {
          from: "karaokeapp23@gmail.com",
          to: email,
          subject: "Forgot Password",
          html: `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0;">
  <tr>
    <td align="center">
 
      <!-- Email Container -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;background:#333;border-radius:8px;
                    box-shadow:0 8px 24px rgba(0,0,0,0.08);">
 
        <!-- Header -->
        <tr>
          <td align="center" style="padding:50px 20px 10px;">
 
            <img src="https://159.223.251.167:3000/image/logo.png" style="max-width:200px; object-fit: contain; margin-bottom: 30px;" />
            <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;
                       font-size:20px;color:#fff;">
              Reset Your Password
            </h1>
          </td>
        </tr>
 
        <!-- Subtext -->
        <tr>
          <td align="center" style="padding:0 30px 20px;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                      font-size:15px;color:#fff;line-height:1.6;">
             Please click below link to change password
            </p>
          </td>
        </tr>
 
        <!-- Button -->
        <tr>
          <td align="center" style="padding:20px 20px 50px;">
            <a href="https://159.223.251.167:3000/verifyPassword/${token}"
               style="display:inline-block;
                      padding:14px 28px;
                      background:#0D8EC5;
                      color:#ffffff;
                      text-decoration:none;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:16px;
                      font-weight:bold;
                      border-radius:6px;">
              Change Password
            </a>
          </td>
        </tr>
 
 
       
      </table>`,
        };
        transporter.sendMail(mailOptions, async function (error, info) {
          console.log("error", error);
          if (error) {
            return res.json({
              success: false,
              message: "Mail Not delivered",
            });
          } else {
            return res.json({
              success: true,
              message:
                "An email has been sent to you with detailed instructions on how to change password.",
              userinfo: result.rows,
              status: 200,
            });
          }
        });
      } else {
        return res.json({
          success: false,
          message: "User is not registered with karakover",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id  is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result = await fetchUserById(user_id);
      if (result.length != 0) {
        const hash = await bcrypt.hash(password, saltRounds);
        const result2 = await updateUserbyPass(hash, user_id);

        if (result2) {
          return res.json({
            success: true,
            status: 200,
            message: "Password Changed Successfully",
          });
        } else {
          return res.json({
            success: false,
            message: "Some error occured. Please try again",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "User Not Found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const { user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id  is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const results = await fetchUserById(user_id);
      const instrument = await fetchInstrumentUserid(user_id);

      if (results.length !== 0) {
        if (results[0]["image"] === null) {
          profileImage = "";
        } else {
          profileImage =
            "https://159.223.251.167:3000/uploads/" + results[0]["image"];
          // "https://159.223.251.167:3000/uploads/" + result[0]["image"];
        }

        let userdetail = {
          id: results[0]["id"],
          firstname: results[0]["firstname"],
          lastname: results[0]["lastname"],
          email: results[0]["email"],
          phone: results[0]["phone"],
          image: profileImage,
          instrument_selected: instrument[0]["instrument_selected"],
        };

        return res.json({
          message: "fetch user details success",
          status: 200,
          success: true,
          data: userdetail,
        });
      } else {
        return res.json({
          message: "fetch details failed",
          status: 400,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.sociallogin = async (req, res) => {
  try {
    const { email, full_name, social } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.number().empty(), Joi.string().empty()],
        social: [Joi.number().empty(), Joi.string().empty()],
        firstname: [Joi.number().empty(), Joi.string().empty()],
        lastname: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result = await fetchUserbysocial(email, social);
      const usersemail = await fetchUser(email);

      if (result.length != 0) {
        const token = jwt.sign(
          {
            data: {
              id: result[0].id,
            },
          },
          "SecretKey"
        );
        return res.json({
          success: true,
          message: "Successfully social Login",
          userinfo: result,
          token: token,
        });
      } else if (usersemail.length != 0) {
        const updateUser = await updateUsersocail(social, email);
        const token = jwt.sign(
          {
            data: {
              id: usersemail[0].id,
            },
          },
          "SecretKey"
        );
        return res.json({
          success: true,
          message: "Successfully social Login",
          userinfo: usersemail,
          token: token,
        });
      } else {
        const result2 = await addUser(req.body);

        if (result2 && result2.insertId != 0) {
          const result3 = await fetchUserbyId(result2.insertId);

          const token = jwt.sign(
            {
              data: {
                id: result2.insertId,
              },
            },
            "SecretKey"
          );

          return res.json({
            success: true,
            message: "Successfully social Login",
            userinfo: result3,
            token: token,
          });
        } else {
          return res.json({
            success: false,
            message: "Some error occured. Please try again",
            userinfo: result2,
          });
        }
      }
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      userinfo: [],
      status: 500,
    });
  }
};

exports.verifyhomeUser = async (req, res) => {
  try {
    const { token, id } = req.params;
    const schema = Joi.alternatives(
      Joi.object({
        token: [Joi.number().empty(), Joi.string().empty()],
        id: [Joi.number().empty(), Joi.string().empty()],
      })
    );

    const result = schema.validate(req.params);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result = await fetchUserActToken(token);
      if (result.length != 0) {
        let data = { act_token: "" };
        const token = jwt.sign(
          {
            data: {
              id: result[0].id,
            },
          },
          "SecretKey"
        );

        const resultUpdate = await updateVerifyUser(data, result[0].id);
        if (resultUpdate.affectedRows) {
          res.sendFile(__dirname + "/view/verify.html");
        } else {
          res.sendFile(__dirname + "/view/notverify.html");
        }
      } else {
        res.sendFile(__dirname + "/view/notverify.html");
      }
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.getSongsOfArtist = async (req, res) => {
  try {
    const { artist_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        artist_id: Joi.number().empty().required().messages({
          "number.empty": "artist_id can't be empty",
          "number.required": "artist_id is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const results = await fetchArtistSongsById(artist_id);
      if (results.length !== 0) {
        return res.json({
          message: "fetch artist details success",
          status: 200,
          success: true,
          data: results,
        });
      } else {
        return res.json({
          message: "fetch details failed",
          status: 400,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).send("Invalid link");
    } else {
      const result = await fetchUserToken(token);

      if (result.length != 0) {
        localStorage.setItem("vertoken", token);

        res.sendFile(path.join(__dirname + "/view/forgetPassword.html"), {
          msg: "",
        });
      } else {
        res.sendFile(path.join(__dirname + "/view/notFound.html"), {
          msg: "Page Not Found",
        });
      }
    }
  } catch (err) {
    res.send(`<div class="container">
          <p>404 Error, Page Not Found</p>
          </div> `);
  }
};

exports.updatePassword = async (req, res) => {
  const { password, confPassword } = req.body;
  const token = localStorage.getItem("vertoken");

  try {
    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        confPassword: Joi.string().empty().required().messages({
          "string.empty": "token can't be empty",
          "string.required": "token is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else if (password !== confPassword) {
      res.send(`<div class="container">
          <p>Password and Confirm Password do not match</p>
          </div> `);
    } else {
      //  const token = localStorage.getItem('vertoken');

      const result = await fetchUserToken(token);
      if (result.length != 0) {
        const hash = await bcrypt.hash(password, saltRounds);
        const result2 = await updPasswdByToken(hash, token);

        if (result2) {
          await tokenUpdate(result[0].id);
          res.sendFile(path.join(__dirname + "/view/message.html"), {
            msg: "",
          });
        } else {
          res.send(`<div class="container">
                  <p>Internal Error Occured, Please contact Support.</p>
                  </div> `);
        }
      } else {
        res.send(`<div class="container">
                <p>User is not registered with Exam Simplify.</p>
                </div> `);
      }
    }
  } catch (error) {
    console.log(error);
    res.send(`<div class="container">
                <p>Internal Server Error.</p>
                </div> `);
  }
};

exports.getSongsOfArtistByGenre = async (req, res) => {
  try {
    const { genre } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        genre: Joi.number().empty().required().messages({
          "number.empty": "genre id can't be empty",
          "number.required": "genre id is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const results = await fetchSongsByGenreId(genre);
      if (results.length !== 0) {
        return res.json({
          message: "fetch genre details success",
          status: 200,
          success: true,
          data: results,
        });
      } else {
        return res.json({
          message: "fetch details failed",
          status: 400,
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.song_request = async (req, res) => {
  try {
    const { user_id, message } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required().messages({
          "number.empty": "user_id can't be empty",
          "number.required": "user_id is required",
        }),
        message: Joi.string().empty().required().messages({
          "string.empty": "message can't be empty",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let data = {
        user_id: user_id,
        message: message,
      };

      const result = await insertSongRequest(data);
      if (result) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Insert song request successfully!",
          data: result,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.insertNotification = async (req, res) => {
  try {
    const { receiver_id, message } = req.body;
    let data = {
      receiver_id: receiver_id,
      message: message,
    };

    const result = await insertIntoNotification(data);
    if (result) {
      return res.status(200).json({
        message: "Insert notification successfully!",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.Allnotification = async (req, res) => {
  try {
    const { receiver_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        receiver_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate(req.body);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const notification = await get_notification(receiver_id);
      if (notification.length > 0) {
        return res.json({
          success: true,
          status: 200,
          message: "Successfully fetch Notification",
          notification: notification,
        });
      } else {
        return res.json({
          success: true,
          message: "No Data Found",
          notification: [],
          status: 404,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};
