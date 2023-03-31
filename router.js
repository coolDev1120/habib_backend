
const router = require('express').Router();
const Authentication = require('./controllers/authentication');
const Job = require('./controllers/job');
const Material = require('./controllers/material');
const Setting = require('./controllers/setting');
const User = require('./controllers/user')
const Task = require('./controllers/task')
const Event = require('./controllers/event')
const Info = require('./controllers/info')
const Contact = require('./controllers/contact')
const Asset = require('./controllers/asset')
const Smtp = require('./controllers/SMTP')
const Smtp2 = require('./controllers/SMTP2')


const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        // You could use the original name
        // cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage })


router.post('/signin', Authentication.signin);
router.post('/signup', Authentication.signup);
router.get('/resetPassword', Authentication.resetPassword)

// SMTP
router.post('/sendEmail', Smtp.sendEmail)
router.post('/sendEmail0', Smtp.sendEmail0)
router.post('/receiveEmail', Smtp2.receiveEmail)
router.post('/detailEmail', Smtp2.detailEmail)
router.post('/sendemailById', Smtp2.sendemailById)
router.post('/updateImportant', Smtp2.updateImportant)
router.post('/updateStarred', Smtp2.updateStarred)
router.post('/deleteEmailByID', Smtp2.deleteEmailByID)
router.post('/acceptEmailById', Smtp2.acceptEmailById)
router.post('/rejectEmailById', Smtp2.rejectEmailById)
router.post('/getRepliedEmailById', Smtp2.getRepliedEmailById)
router.post('/getEmailById', Smtp2.getEmailById)
router.post('/getLabels', Smtp2.getLabels)
router.post('/addemail', Smtp2.addemail)
router.post('/getemail', Smtp2.getemail)
router.post('/deletemail', Smtp2.deletemail)
router.post('/getemailsByid', Smtp2.getemailsByid)
router.post('/updatemailById', Smtp2.updatemailById)
router.post('/mailAnalyse', Smtp2.mailAnalyse)



// Jobs
router.post('/getjobs', Job.getjobs)
router.post('/addjobs', Job.addjob)
router.post('/deletejobs', Job.deletejob)
router.post('/getjobByid', Job.getjobByid)
router.post('/editjobs', Job.editjobs)

// Jobs
router.post('/getmaterial', Material.getmaterial)
router.post('/addmaterial', Material.addmaterial)
router.post('/deletematerial', Material.deletematerial)
router.post('/getmaterialByid', Material.getmaterialByid)
router.post('/editmaterial', Material.editmaterial)

// Task
router.post('/addtask', Task.addtask)
router.post('/gettask', Task.gettask)
router.post('/deletetask', Task.deletetask)
router.post('/edittask', Task.edittask)
router.post('/gettaskByid', Task.gettaskByid)

// User
router.post('/getusers', User.getusers)
router.post('/addaccount', Authentication.addaccount)
router.post('/deleteAccount', Authentication.deleteAccount)
router.post('/getAccountById', Authentication.getAccountById)
router.post('/updateAccountById', Authentication.updateAccountById)

// Calendar
router.post('/getevent', Event.getevent)
router.post('/addevent', Event.addevent)
router.post('/editevent', Event.editevent)
router.post('/deleteevent', Event.deleteevent)

// Contact
router.post('/getContact', Contact.get)
router.post('/addContact', Contact.add)
router.post('/editContact', Contact.edit)
router.post('/deleteContact', Contact.delete)
router.post('/getContactByid', Contact.getByid)

// setting
router.post('/uploadimage', upload.single('photo'), Setting.uploadPorfileImg)
router.post('/setting/getAccount', Setting.getAccount);
router.post('/setting/saveAccount', Setting.saveAccount);
router.post('/setting/changeAccount', Setting.changeAccount);
router.post('/setting/changePassword', Authentication.changePassword);
router.post('/setting/updateAccount', Authentication.updateAccount);

// assets
router.post('/getAssets', Asset.get)
router.post('/addAssets', Asset.add)
router.post('/editAssets', Asset.edit)
router.post('/deleteAssets', Asset.delete)
router.post('/getAssetsByid', Asset.getByid)

// get Info
router.post('/getCompany', Info.getCompany)
router.post('/getCategory', Info.getCategory)
router.post('/getSubCategory', Info.getSubcategory)
router.post('/getSub2Category', Info.getSub2category)
router.post('/getTeam', Info.getTeam)




// // Schedule
// router.post('/setting/saveSchedule', Setting.saveSchedule);
// router.post('/setting/getSchedule', Setting.getSchedule);
// router.post('/setting/saveUserSchedule', Setting.saveUserSchedule);
// router.post('/setting/getMySchedule', Setting.getMySchedule);
// router.post('/setting/deleteMySchedule', Setting.deleteMySchedule);

// router.post('/getTutorById', Setting.getTutorById);

// // Chat 
// router.post('/saveMessage', Chat.saveMessage);
// router.post('/getmessage', Chat.getMessages);
// router.post('/getchatlist', Chat.getChatList);
// router.post('/readallmessages', Chat.readallmessages);


module.exports = router;