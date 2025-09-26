const express = require("express");
const router = express.Router();
//Insert Model
const Booking = require("../models/BookingModel");
//Insert Booking Controller
const BookingController = require("../controllers/BookingController");

//Route path
router.get("/",BookingController.getAllBookings);
router.post("/",BookingController.addBookings);
router.get("/:id",BookingController.getById);
router.put("/:id",BookingController.updateBooking);
router.delete("/:id",BookingController.deleteBooking);

//export
module.exports = router;