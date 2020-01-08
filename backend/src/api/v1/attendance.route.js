import Router from 'express'
import { asyncRoute } from '../../utils/api'
import random from 'random-number-csprng'
const AttendanceDay = require('../../models/AttendanceDay')
const AttendanceUser = require('../../models/AttendanceUser')
const router = Router()
var moment = require('moment')
var ranNum = random(100, 999)

//state,name
router.post(
    '/attendanceWrite',
    asyncRoute(async function(req, res) {
        if (ranNum != req.body.code) {
            res.json({
                message: 'wrongCode!',
                result: 0,
            })
        }
        var Date = moment().format('YYYYMMDD')
        var Name = req.user.username
        try {
            var cursor_Day = await AttendanceDay.findOne()
                .where('day')
                .equals(Date)
            if (!cursor_Day) {
                var attendanceDay = new AttendanceDay()
                attendanceDay.day = Date
                attendanceDay.addStatus(Name, req.body.state)
            } else {
                cursor_Day.addStatus(Name, req.body.state)
            }
        } catch (err) {
            console.log(err) // eslint-disable-line no-console
            res.status(501).json(err)
        }
        try {
            var cursor_User = await AttendanceUser.findOne()
                .where('name')
                .equals(Name)
            if (!cursor_User) {
                var attendanceUser = new AttendanceUser()
                attendanceUser.name = Name
                attendanceUser.addStatus(Date, req.body.state)
                res.json({ result: 1 })
            } else {
                cursor_User.addStatus(Date, req.body.state)
                res.json({ result: 1 })
            }
        } catch (err) {
            console.log(err) // eslint-disable-line no-console
            res.status(501).json(err)
        }
    })
)

router.get(
    '/attendanceCheck',
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        var Name = req.user.username
        try {
            const cursor = await AttendanceDay.find({
                day: Date,
                'status.name': Name,
            })
            if (cursor != '') {
                res.json(1)
            } else {
                res.json(0)
            }
        } catch (err) {
            console.log(err) // eslint-disable-line no-console
            res.status(501).json(err)
        }
    })
)

router.get(
    '/startAttendance',
    asyncRoute(async function(req, res) {
        try {
            ranNum = await random(100, 999)
            res.json({ code: ranNum })
        } catch (err) {
            console.log(err) // eslint-disable-line no-console
            res.status(501).json
        }
    })
)
export default router