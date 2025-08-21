const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { razorPayInstance } = require('../utils/razorpay');
const Payment = require('../models/payment');
const { membership_type_amount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

const paymentRouter = express.Router();

paymentRouter.post("/payment/order", userAuth, async (req, res) => {
    try {
        const { firstName, lastName, emailId } = req.user;
        const { type } = req.body;

        const order = await razorPayInstance.orders.create({
            amount: membership_type_amount[type] * 100,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                membershipType: type
            }
        });

        const payment = new Payment({
            userId: req.user._id,
            amount: order.amount,
            orderId: order.id,
            currency: order.currency,
            notes: order.notes,
            receipt: order.receipt,
            status: order.status
        });

        const savedPayment = await payment.save();
        res.json({ ...savedPayment.toJSON(), key: process.env.RAZORPAY_KEY_ID });
    }
    catch (err) {
        console.log(err);
    }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        console.log("Webhook called");
        const webhookSignature = req.get("X-Razorpay-Signature");
        const isWebHookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        console.log("isWebHookValid ", isWebHookValid);
        if (!isWebHookValid) {
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }

        const paymentDetails = req.body.payload.payment.entity;

        console.log(paymentDetails);
        // update the payment status in DB

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        payment.paymentId = paymentDetails.id;

        await payment.save();
        // make user as premium in DB

        const user = await User.findById(payment.userId);

        console.log(user);
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if (req.body.eveny === 'payment.captured') {

        // }
        // if (req.body.eveny === 'payment.failed') {
        // }

        return res.status(200).json({ msg: "Webhook received successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
});

module.exports = paymentRouter;