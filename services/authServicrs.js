const usermodel = require("../models/userModels");
const Post_1 = require("../models/post_1_Models");
const Post_2 = require("../models/post_2_Models");
const Post_3 = require("../models/post_3_Models");
const Post_4 = require("../models/post_4_Models");
const ApiError = require("../ApiError");

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");

const sendemail = require("../resetEmail");
const sendemailMe = require("../sindEmailMe");

// -----------------------------------
const session = require('express-session'); // لضمان استخدام الجلسات
// -----------------------------------

exports.sign_up = asyncHandler(async (req, res, next) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // رمز تحقق عشوائي مكون من 6 أرقام

    // حفظ البيانات في الجلسة بدلاً من التخزين المباشر في قاعدة البيانات
    req.session.tempUser = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 12),
        passwordConfirm: req.body.passwordConfirm,
        verificationCode: verificationCode // تخزين رمز التحقق في الجلسة
    };

    // إعداد البيانات لإرسال البريد الإلكتروني
    const emailData = {
        email: req.body.email,
        subject: 'Verification Code',
        message: `Your verification code is: ${verificationCode}`
    };

    console.log(req.session.tempUser);

    // إرسال البريد الإلكتروني
    await sendemail(emailData);

    // إعادة توجيه المستخدم إلى صفحة التحقق
    res.status(200).json({ data: req.session.tempUser });
});

// ---------------------------------------
exports.verify_code = asyncHandler(async (req, res, next) => {
    const { verificationCode } = req.body;
    const tempUser = req.body.tempUser;

    if (!tempUser || tempUser.verificationCode !== parseInt(verificationCode, 10)) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    const user = await usermodel.create({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password,
        passwordConfirm: tempUser.passwordConfirm,
        isVerified: true
    });

    const token = jsonwebtoken.sign(
        { userID: user._id },
        process.env.WJT_SECRET,
        { expiresIn: process.env.WJT_EXPIRESIN }
    );

    req.session.tempUser = null;

    res.status(200).json({ data: user, token });
});

// ---------------------------------------
exports.login = asyncHandler(async (req, res, next) => {
    const user = await usermodel.findOne({ email: req.body.email });

    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return next(new ApiError("Email or password is incorrect", 401));
    }

    const token = jsonwebtoken.sign(
        { userID: user._id },
        process.env.WJT_SECRET,
        { expiresIn: process.env.WJT_EXPIRESIN }
    );

    user.active = true;
    await user.save();

    res.status(201).json({ data: user, token });
});

// ---------------------------------------
exports.check_login = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        return next(new ApiError("Please enter the token", 401));
    }

    const codetoken = jsonwebtoken.verify(token, process.env.WJT_SECRET);

    const user = await usermodel.findById(codetoken.userID);
    if (!user) {
        return next(new ApiError("User does not exist or token is invalid", 401));
    }

    if (user.password_Update_Time) {
        if (parseInt(user.password_Update_Time.getTime() / 1000) > codetoken.iat) {
            return next(new ApiError("Please log in again.", 401));
        }
    }

    if (user.active === false) {
        return next(new ApiError("Please log in again", 401));
    }

    req.user = user;
    next();
});

// ---------------------------------------
exports.check_user_role = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ApiError("You do not have the authority to perform this action.", 403));
    }

    next();
});

// ---------------------------------------
exports.get_user_my = asyncHandler(async (req, res, next) => {
    const user = await usermodel.findById(req.user._id);

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    res.status(200).json({ data: user });
});

// ----------------------------------------
exports.update_user_my = asyncHandler(async (req, res, next) => {
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }

    const updateData = {
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone
    };

    // تحديث الحقل profileImage فقط إذا كانت الصورة موجودة
    if (req.body.profilImage) {
        updateData.profilImage = `${process.env.BASE_URL}/user/${req.body.profilImage}`;
    }

    const user = await usermodel.findOneAndUpdate(
        { _id: req.user._id },
        updateData,
        { new: true }
    );

    if (!user) {
        return next(new ApiError("There is no user with this ID", 404));
    }

    res.status(200).json({ data: user });
});

// ----------------------------------------
exports.update_user_password_my = asyncHandler(async (req, res, next) => {
    const user = await usermodel.findOneAndUpdate(
        { _id: req.user._id },
        {
            password: await bcrypt.hash(req.body.newpassword, 12),
            password_Update_Time: Date.now()
        },
        { new: true }
    );

    if (!user) {
        return next(new ApiError("There is no user with this ID", 404));
    }

    const token = jsonwebtoken.sign(
        { userID: user._id },
        process.env.WJT_SECRET,
        { expiresIn: process.env.WJT_EXPIRESIN }
    );

    res.status(200).json({ data: user, token });
});

// ---------------------------------------
exports.logout = asyncHandler(async (req, res, next) => {
    const user = await usermodel.findOneAndUpdate(
        { _id: req.user._id },
        { active: false },
        { new: true }
    );

    if (!user) {
        return next(new ApiError("There is no user with this ID", 404));
    }

    res.status(200).json({ data: user });
});

// --------------------------------------
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    user.verificationCode = verificationCode;
    await user.save();

    const emailData = {
        email: user.email,
        subject: 'Verification code to reset password',
        message: `The verification code is: ${verificationCode}`
    };

    await sendemail(emailData);

    res.status(200).json("A verification code has been sent to your email.");
});

exports.verifyResetPassword = asyncHandler(async (req, res, next) => {
    const { email, verificationCode } = req.body;
    const user = await usermodel.findOne({ email, verificationCode });

    if (!user) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    res.status(200).json("Please change your password now");
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { newPassword, passwordConfirm, email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (newPassword !== passwordConfirm) {
        return res.status(400).json({ message:'Passwords do not match' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
});

// ----------------------------------------
exports.receiveAndSendEmailMe = asyncHandler(async (req, res, next) => {
    const { email, subject, message } = req.body;

    const mailObject = {
        email,
        subject,
        message
    };

    try {
        await sendemailMe(mailObject);
        res.status(200).json({ message: 'Your message has been sent successfully' });
    } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ message: 'An error occurred while sending the message. Try again.' });
    }
});


// =================================================

exports.Send_friend_request = asyncHandler(async (req, res, next) => {
    const senderId  = req.user._id;
    const receiverId = req.params.userId;

    try {
        // التحقق من وجود المستخدمين
        const sender = await usermodel.findById(senderId);
        const receiver = await usermodel.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // إضافة طلب الصداقة إلى قائمة طلبات الصداقة الخاصة بالمستقبل
        receiver.Friend_requests.push({ friend: senderId });
        await receiver.save();

        res.status(200).json({
            message: "Friend request sent successfully",
        });
    } catch (error) {
        next(error);
    }
});



// ================================================================

exports.Accept_friend_request = asyncHandler(async (req, res, next) => {
    const requesterId = req.params.userID; // معرف الشخص الذي أرسل الطلب
    const userId = req.user._id; // معرف المستخدم الذي يقبل الطلب

    try {
        // العثور على المستخدمين
        const user = await usermodel.findById(userId);
        const requester = await usermodel.findById(requesterId);

        if (!user || !requester) {
            return res.status(404).json({ message: "User not found" });
        }

        // التأكد من أن الطلب موجود
        const requestIndex = user.Friend_requests.findIndex(
            (req) => req.friend.toString() === requesterId
        );

        if (requestIndex === -1) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // إضافة إلى قائمة الأصدقاء
        user.friends.push({ friend: requesterId });
        requester.friends.push({ friend: userId });

        // إزالة طلب الصداقة
        user.Friend_requests.splice(requestIndex, 1);

        // حفظ التعديلات
        await user.save();
        await requester.save();

        res.status(200).json({
            message: "Friend request accepted successfully",
        });
    } catch (error) {
        next(error); // تمرير الخطأ إلى معالج الأخطاء العامة
    }
});



// ========================================================

exports.Reject_friend_request = asyncHandler(async (req, res, next) => {
    const requesterId = req.params.userID; // معرف الشخص الذي أرسل الطلب
    const userId = req.user._id; // معرف المستخدم الذي يرفض الطلب

    try {
        // العثور على المستخدم
        const user = await usermodel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // التأكد من أن الطلب موجود
        const requestIndex = user.Friend_requests.findIndex(
            (req) => req.friend.toString() === requesterId
        );

        if (requestIndex === -1) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        // إزالة طلب الصداقة
        user.Friend_requests.splice(requestIndex, 1);

        // حفظ التعديلات
        await user.save();

        res.status(200).json({
            message: "Friend request rejected successfully",
        });
    } catch (error) {
        next(error); // تمرير الخطأ إلى معالج الأخطاء
    }
});


// ==================================================================================
exports.toggleSavedPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params; // معرف المنشور من البرامس

    // جميع النماذج
    const postModels = [Post_1, Post_2, Post_3, Post_4];
    let foundPost = null;
    let postModelName = null;

    // البحث عن المنشور في جميع النماذج
    for (const model of postModels) {
        foundPost = await model.findById(postId);
        if (foundPost) {
            postModelName = model.modelName; // حفظ اسم النموذج
            break;
        }
    }

    // التحقق إذا لم يتم العثور على المنشور
    if (!foundPost) {
        return res.status(404).json({
            message: "The post does not exist.",
        });
    }

    // الحصول على المستخدم
    const user = await usermodel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            message: "User does not exist.",
        });
    }

    // التحقق من حفظ المنشور مسبقًا
    const savedIndex = user.savedPosts.findIndex(
        (savedPost) => savedPost.post.toString() === postId
    );

    if (savedIndex !== -1) {
        // إذا كان محفوظًا مسبقًا، قم بإزالته
        user.savedPosts.splice(savedIndex, 1);
        await user.save();
        return res.status(200).json({
            message: "The post was successfully unsaved.",
            savedPosts: user.savedPosts,
        });
    }

    // إضافة المنشور إذا لم يكن محفوظًا
    user.savedPosts.push({ post: postId, postModel: postModelName });
    await user.save();

    res.status(200).json({
        message: "Post saved successfully.",
        savedPosts: user.savedPosts,
    });
});