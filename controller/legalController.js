const { fetchPrivacyPolicy, fetchTermAndCondition, fetchMixerStatus } = require("../models/home");

exports.getPrivacyPolicy = async (req, res) => {
  try {
    const results = await fetchPrivacyPolicy();

    if (!results || results.length === 0) {
      return res.json({
        message: "Privacy policy not found",
        status: 404,
        success: false,
        data: {},
      });
    }

    return res.json({
      message: "Fetch privacy policy success",
      status: 200,
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.getTermsAndConditions = async (req, res) => {
  try {
    const results = await fetchTermAndCondition();

    if (!results || results.length === 0) {
      return res.json({
        message: "Terms and conditions not found",
        status: 404,
        success: false,
        data: {},
      });
    }

    return res.json({
      message: "Fetch terms and conditions success",
      status: 200,
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.getMixerStatus = async (req, res) => {
  try {
    const results = await fetchMixerStatus();

    return res.json({
      message: "Fetch mixer status.",
      status: 200,
      data: results[0],
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

