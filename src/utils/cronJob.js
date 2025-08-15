const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const connectionRequestModel = require('../models/connectionRequest');
const sendEmail = require('./sendEmail');

//Run at 8 am in the morning everyday
cron.schedule('0 8 * * *', async () => {

    //send the email to users who have received the request yesterday

    try {
        const yesterday = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await connectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate('fromUserId toUserId');

        const emailList = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];
        for (const emailId of emailList) {
            try {
                const emailRes = await sendEmail.run(
                    "New Requests Received Yesterday from " + emailId,
                    "Accept or reject the connection requests received from the users by logging into tinderdev.com"
                );
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
