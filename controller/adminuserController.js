const { fetchAlluser,fetchUserById, addUser,fetchUserByEmail,
    updateUserById,deleteUser} = require('../models/users');

const Joi = require('joi');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const saltRounds = 10;

const moment = require('moment');
// const fs = require('fs');
// const util = require('util');
// const unlinkFile = util.promisify(fs.unlink);

function betweenRandomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    // secure: true,
    auth: {
        user: 'acentrally@gmail.com',
        pass: 'olyuklbilewkzeod'
    }
});

exports.allUsers = (async (req, res) => {
    try {       
           const results = await fetchAlluser();
            if (results.length > 0) {              
                return res.json({
                    message: "fetch user details success",
                    status: 200,
                    success: true,
                    data: results
                })
            }
            else {
                return res.json({
                    message: "fetch details failed",
                    status: 400,
                    success: false,
                    data: []
                })
            }
        
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});


exports.addUser = (async (req, res) => {
    try {
         var CurrentDate = moment().format();
        const { email, firstname, lastname, password,phone } = req.body;
       // const actToken = betweenRandomNumber(10000000, 99999999);
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({tlds: { allow: false } })
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
                phone: [Joi.number().empty().required(),Joi.string().empty().required()]
                
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
          else 
        {
            const result = await fetchUserByEmail(email);

            let filename = '';
            if(req.file) {
                const file = req.file
                filename = file.filename;
            }
         
            if (result.length === 0) {
                bcrypt.genSalt(saltRounds, async function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err) throw err;

                        let user = {
                            email: email,
                            password: hash,
                            firstname:firstname,
                            lastname:lastname,
                            phone:phone,
                            // act_token: actToken,
                            created_at:CurrentDate,
                            image:filename
                        }
                        const result = await addUser(user);

                        if (result.affectedRows > 0 ) {               
                            return res.json({
                                success: true,
                                message: "Your account has been successfully created.", 
                                userinfo: [{id:result.insertId}],
                                status: 200
                            });
                        } else {
                            return res.json({
                                message: "user failed to register",
                                status: 400,
                                userinfo:[],
                                success: false
                            })
                        }
                    });
                });

             } else {
                return res.json({
                    success: false,
                    message: "Already Exists",
                    status: 400,
                    userinfo:[],
                });
            }

        }
    } catch (error) {
        console.log(error, "<==error")
        return res.json({
            message: "Internal server error",
            status: 500,
            success: false
        })
    }
});

exports.editProfile =  ( async (req, res) => {
    try{

           const { email, firstname, lastname, phone, user_id } = req.body;
           const schema = Joi.alternatives(
               Joi.object({
                   email: [Joi.number().empty(),Joi.string().empty()],
                   firstname: [Joi.number().empty(),Joi.string().empty()],
                   lastname: [Joi.number().empty(),Joi.string().empty()],
                   phone: [Joi.number().optional().allow(''),Joi.string().optional().allow('')],                 
                   user_id: [Joi.number().empty(),Joi.string().empty()],             
               })
           );
           const result = schema.validate({ email, firstname, lastname, phone, user_id});
   
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
           
            let filename = '';
            if(req.file) {
                const file = req.file
                filename = file.filename;
            }
        
               const userInfo = await fetchUserById(user_id);
               if (userInfo.length !== 0) {
                   let user = {
                       email: email ? email : userInfo[0].email,
                       firstname: firstname ? firstname : userInfo[0].firstname,
                       lastname: lastname ? lastname : userInfo[0].lastname,
                       phone: phone ? phone : userInfo[0].phone,
                       image:filename?filename : userInfo[0].image,
                   };
                   const result = await updateUserById(user, user_id);
                   if (result.affectedRows) {
                       return res.json({
                           message: "update user successfully",
                           status: 200,
                           success: true
                       })
                   }
                   else {
                       return res.json({
                           message: "update user failed ",
                           status: 400,
                           success: false
                       })
                   }
               }
               else {
                   return res.json({
                       messgae: "data not found",
                       status: 400,
                       success: false
                   })
               }
           }
       } catch(err) {
        console.log(err);

           return res.json({
               success: false,
               message: "Internal server error",
               error: err,
               status: 500
           })
       }
   
});

exports.userProfile = (async (req, res) => {
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
        }
        else {
            const results = await fetchUserById(user_id);
            if (results.length !== 0) {
               
                return res.json({
                    message: "fetch user details success",
                    status: 200,
                    success: true,
                    data: results[0]
                })
            }
            else {
                return res.json({
                    message: "fetch details failed",
                    status: 400,
                    success: false
                })
            }
        }
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});
 
exports.deleteUser = (async (req, res) => {
    try {
        const { user_id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.number().empty().required().messages({
                    "number.empty": "user_id can't be empty",
                    "number.required": "user_id  is required",
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
        }
        else {
            const results = await deleteUser(user_id);
            if (results.affectedRows > 0) {
               
                return res.json({
                    message: "Delete user detail success",
                    status: 200,
                    success: true,
                    data: results[0]
                })
            }
            else {
                return res.json({
                    message: "fetch details failed",
                    status: 400,
                    success: false
                })
            }
        }
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500
        })
    }
});

