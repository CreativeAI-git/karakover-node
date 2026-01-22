
const { get_notification_metrics_data, get_notification_data, get_notification_data_by_id, get_notification_metrics_data_by_id, get_user_data_for_notification } = require('../../models/admin/user');
const { get_user_data_by_id } = require('../../models/users');
const pool = require('../../utils/database');
const { handleSuccess, handleError, joiErrorHandle } = require('../../utils/responseHandler');
const Joi = require('joi');


exports.createNotification = async (req, res) => {
    try {
        const notificationSchema = Joi.object({
            notification_title: Joi.string().required(),
            notification_message: Joi.string().required(),
            segment: Joi.string().valid().required(),
            segment_value: Joi.string().required(),
            notification_scheduled_time: Joi.date().optional(),
        });

        const { error, value } = notificationSchema.validate(req.body);
        if (error) return joiErrorHandle(res, error);

        let notification_image = "";
        if (req.file) {
            notification_image = req.file.filename;
        }

        const { notification_title, notification_message, notification_scheduled_time, segment, segment_value } = value;

        const query = `
            INSERT INTO admin_notifications (notification_image, notification_title, notification_message, notification_scheduled_time,segment, segment_value, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `;
        const values = [notification_image, notification_title, notification_message, notification_scheduled_time, segment, segment_value];
        let saved_notification = await pool.query(query, values);
        if (saved_notification.affectedRows > 0) {
            return handleSuccess(res, 201, 'Notification created successfully.');
        }
        return;
    } catch (error) {
        return handleError(res, 500, error.message);
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const query = 'SELECT * FROM admin_notifications where is_sent = 0 ORDER BY created_at DESC;';
        const result = await pool.query(query);
        console.log(result)

        const updatedNotifications = result.map(notification => {
            if (
                notification.notification_image &&
                !notification.notification_image.startsWith("http") &&
                !notification.notification_image.startsWith("No image")
            ) {
                notification.notification_image = `${process.env.APP_URL}${notification.notification_image}`;
            }
            return notification;
        });

        return handleSuccess(res, 200, 'Notifications fetched successfully.', updatedNotifications);
    } catch (error) {
        return handleError(res, 500, error.message);
    }
};

exports.getAllNotifications_all = async (req, res) => {
    try {
        const query = 'SELECT * FROM admin_notifications ORDER BY created_at DESC;';
        const result = await pool.query(query);
        console.log(result)

        const updatedNotifications = result.map(notification => {
            if (
                notification.notification_image &&
                !notification.notification_image.startsWith("http") &&
                !notification.notification_image.startsWith("No image")
            ) {
                notification.notification_image = `${process.env.APP_URL}${notification.notification_image}`;
            }
            return notification;
        });

        return handleSuccess(res, 200, 'Notifications fetched successfully.', updatedNotifications);
    } catch (error) {
        return handleError(res, 500, error.message);
    }
};

exports.getAllSentNotifications = async (req, res) => {
    try {
        const query = 'SELECT * FROM admin_notifications WHERE is_sent = 1 ORDER BY created_at DESC;';
        const result = await pool.query(query);
        console.log(result)

        const updatedNotifications = result.map(notification => {
            if (
                notification.notification_image &&
                !notification.notification_image.startsWith("http") &&
                !notification.notification_image.startsWith("No image")
            ) {
                notification.notification_image = `${process.env.APP_URL}${notification.notification_image}`;
            }
            return notification;
        });

        return handleSuccess(res, 200, 'Notifications fetched successfully.', updatedNotifications);
    } catch (error) {
        return handleError(res, 500, error.message);
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const query = 'SELECT * FROM admin_notifications WHERE notification_id = ?;';
        const result = await pool.query(query, [notification_id]);
        console.log(result)
        if (result.length === 0) {
            return handleError(res, 404, 'Notification not found.');
        }
        const notification = result[0];
        if (
            notification.notification_image &&
            !notification.notification_image.startsWith("http") &&
            !notification.notification_image.startsWith("No image")
        ) {
            notification.notification_image = `${process.env.APP_URL}${notification.notification_image}`;
        }
        return handleSuccess(res, 200, 'Notification fetched successfully.', notification);
    } catch (error) {
        return handleError(res, 500, error.message);
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const notificationSchema = Joi.object({
            notification_title: Joi.string().required(),
            notification_id: Joi.number().required(),
            notification_message: Joi.string().required(),
            segment: Joi.string().required(),
            segment_value: Joi.string().required(),
            notification_scheduled_time: Joi.date().optional(),
        });

        const { error, value } = notificationSchema.validate(req.body);
        if (error) return joiErrorHandle(res, error);

        const {
            notification_id,
            notification_title,
            notification_message,
            notification_scheduled_time,
            segment,
            segment_value
        } = value;

        const query_get_notification = 'SELECT * FROM admin_notifications WHERE notification_id = ?;';
        const result_get_notification = await pool.query(query_get_notification, [notification_id]);

        if (!result_get_notification || result_get_notification.length === 0) {
            return handleError(res, 404, 'Notification not found.');
        }

        const query = `
            UPDATE admin_notifications
            SET 
                notification_title = ?, 
                notification_message = ?, 
                notification_scheduled_time = ?, 
                segment = ?, 
                segment_value = ?, 
                updated_at = CURRENT_TIMESTAMP
            WHERE notification_id = ?;
        `;
        const values = [
            notification_title,
            notification_message,
            notification_scheduled_time || null,
            segment,
            segment_value,
            notification_id
        ];

        const updateResult = await pool.query(query, values);
        if (updateResult.affectedRows === 0) {
            return handleError(res, 404, 'Notification not found.');
        }

        return handleSuccess(res, 200, 'Notification updated successfully.');
    } catch (error) {
        console.error("Error updating notification:", error);
        return handleError(res, 500, error.message);
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const query = 'DELETE FROM admin_notifications WHERE notification_id = ?';
        const result = await pool.query(query, [notification_id]);

        if (result.length === 0) {
            return handleError(res, 404, 'Notification not found.');
        }
        handleSuccess(res, 200, 'Notification deleted successfully.');
    } catch (err) {
        handleError(res, 500, 'Error deleting notification.');
    }
};

exports.getNotificationMetrics = async (req, res) => {
    try {
        const notification_metrics_data = await get_notification_metrics_data() || []

        const final_data = await Promise.all(
            notification_metrics_data.map(async (notification_metrics) => {
                const [notification_data] = await get_notification_data_by_id(notification_metrics.notification_id)
                const [user_data] = await get_user_data_by_id(notification_metrics.user_id)
                return { ...notification_metrics, notification_data, user_data }
            })
        )
        return handleSuccess(res, 200, "Notification metrics fetched successfully", final_data)
    } catch (error) {
        console.error("Error fetching notification metrics:", error);
        return handleError(res, 500, error.message)
    }
};

exports.getNotificationMetricsDataById = async (req, res) => {
    try {
        const get_notification_schema = Joi.object({
            notification_id: Joi.number().required()
        })
        const { error, value } = get_notification_schema.validate(req.body)

        const { notification_id } = value
        const notification_metrics_data = await get_notification_metrics_data_by_id(notification_id) || []

        const final_data = await Promise.all(
            notification_metrics_data.map(async (notification_metrics) => {
                const [notification_data] = await get_notification_data_by_id(notification_metrics.notification_id)
                const [user_data] = await get_user_data_by_id(notification_metrics.user_id)
                return { ...notification_metrics, notification_data, user_data }
            })
        )
        return handleSuccess(res, 200, "Notification metrics fetched successfully", final_data)
    } catch (error) {
        console.error("Error fetching notification metrics:", error);
        return handleError(res, 500, error.message)
    }
};

exports.change_notification_status = async (req, res) => {
    try {

        const user_id = req.user?.id
        console.log(user_id, "user_id");

        const notificationSchema = Joi.object({
            notification_id: Joi.number().required(),
            notification_status: Joi.string().valid("viewed").required(),
        });

        const { error, value } = notificationSchema.validate(req.body);
        if (error) return joiErrorHandle(res, error);

        const {
            notification_id,
            notification_status
        } = value;

        const query_get_notification = 'SELECT * FROM notification_metrics WHERE notification_id = ? AND user_id = ?;';
        const result_get_notification = await pool.query(query_get_notification, [notification_id, user_id]);

        if (!result_get_notification || result_get_notification.length === 0) {
            return handleError(res, 404, 'Notification not found.');
        }

        const query = `
            UPDATE notification_metrics
            SET 
                status = ?
            WHERE notification_id = ? AND user_id = ?;
        `;
        const values = [
            notification_status,
            notification_id,
            user_id
        ];

        const updateResult = await pool.query(query, values);
        if (updateResult.affectedRows === 0) {
            return handleError(res, 404, 'Notification not found.');
        }

        return handleSuccess(res, 200, 'Notification  Status updated successfully.');
    } catch (error) {
        console.error("Error updating notification:", error);
        return handleError(res, 500, error.message);
    }
};


// (async () => {
//     let result = await get_user_data_for_notification("subscription_type", "Plus")
//     console.log(result, "result");
//     console.log("********************************8");
//     console.log("********************************8");
//     console.log("********************************8");

// })()