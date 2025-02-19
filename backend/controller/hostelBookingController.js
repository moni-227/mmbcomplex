const HostelBooking = require('../model/HostelBooking');
const path = require('path');
const fs = require('fs');
const payment = require('../model/payment');



// Create a new hostel booking
exports.createBooking = async (req, res) => {
  try {
    const { fullName, email, phone, checkInDate, gender, frontIdProof, backIdProof, paymentMethod, advanceAmount, rentAmount, specialRequests,checkOutDate } = req.body;
    if (frontIdProof) {
      const frontIdData = frontIdProof.split(';base64,').pop(); // Extract Base64 data
      fs.writeFile('uploads/frontIdProof.png', frontIdData, { encoding: 'base64' }, (err) => {
        if (err) {
          console.error('Error saving front ID proof:', err);
        } else {
          console.log('Front ID proof saved successfully');
        }
      });
    }
  
    if (backIdProof) {
      const backIdData = backIdProof.split(';base64,').pop(); // Extract Base64 data
      fs.writeFile('uploads/backIdProof.png', backIdData, { encoding: 'base64' }, (err) => {
        if (err) {
          console.error('Error saving back ID proof:', err);
        } else {
          console.log('Back ID proof saved successfully');
        }
      });
    }
  
    const booking = new HostelBooking({
      fullName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      gender,
      frontIdProof,
      backIdProof,
      paymentMethod,
      advanceAmount,
      rentAmount,
      specialRequests
    });


    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await HostelBooking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

exports.getBookingById = async (req, res) => {
  const { bookingId } = req.params;
  console.log('Booking ID:', bookingId); // Log to check if the bookingId is passed correctly

  try {
    const booking = await HostelBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error); // Log the actual error
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
};


// Update booking
exports.updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const updatedData = req.body;

  try {
    const updatedBooking = await HostelBooking.findByIdAndUpdate(bookingId, updatedData, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};


exports. deleteBooking = async (req, res) => {
  try {
    const { id } = req.params; // Get booking ID from URL params

    // Find and delete the booking by its ID
    const booking = await HostelBooking.findByIdAndDelete(id);

    // If no booking is found
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};





const moment = require('moment');

exports.findMissingBookings = async (req, res) => {
  try {
    // Fetch all HostelBooking IDs with full details
    const hostelBookings = await HostelBooking.find({});

    // Fetch all Payment records
    const paymentRecords = await payment.find({}, 'HostelBookingId paymentDate');

    // Group payments by HostelBookingId
    const paymentsByBooking = {};
    paymentRecords.forEach(payment => {
      const id = payment.HostelBookingId.toString();
      if (!paymentsByBooking[id]) {
        paymentsByBooking[id] = [];
      }
      paymentsByBooking[id].push(moment(payment.paymentDate).format('YYYY-MM'));
    });

    // Get the current month
    const currentMonth = moment().format('YYYY-MM');

    // Identify missing months for each person
    const missingMonthsData = hostelBookings.map(booking => {
      const bookingId = booking._id.toString();
      const checkInMonth = moment(booking.checkInDate).format('YYYY-MM');

      // Generate all expected months between check-in and now
      const expectedMonths = [];
      let monthCursor = moment(checkInMonth);
      while (monthCursor.format('YYYY-MM') <= currentMonth) {
        expectedMonths.push(monthCursor.format('YYYY-MM'));
        monthCursor.add(1, 'month');
      }

      // Get the paid months for this booking
      const paidMonths = paymentsByBooking[bookingId] || [];

      // Find missing months
      const missingMonths = expectedMonths.filter(month => !paidMonths.includes(month));

      // Convert the missing months to month names
      const missingMonthNames = missingMonths.map(month => moment(month, 'YYYY-MM').format('MMMM'));

      return {
        booking,
        missingMonths: missingMonthNames // Using month names
      };
    });

    res.status(200).json({
      success: true,
      message: 'Missing months for each HostelBooking',
      missingMonthsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching missing payments',
      error: error.message,
    });
  }
};
