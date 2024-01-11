import cache from '../cache.js';
import {
  GENERAL_ERROR,
  REQUIRED_FIELDS_VALIDATION_FAILED,
} from '../constants.js';
import {
  cancelReservation,
  getListOfRoomIds,
  makeReservation,
} from '../graphql.js';
import {
  handleCancellationResult,
  handleReservationResult,
} from '../results.js';
import utils from '../utils.js';

//POST /reservation/create/
const createReservation = async (req, res) => {
  const fields = req.body;
  const required = ['room_id', 'start_date', 'end_date'];
  if (!utils.validateRequiredFields(fields, required)) {
    return res.status(400).send(REQUIRED_FIELDS_VALIDATION_FAILED);
  }

  try {
    const result = await makeReservation(req.session.jwtToken, {
      room_id: req.body.room_id,
      checkin_date: req.body.start_date,
      checkout_date: req.body.end_date,
    });
    const { success, redirectUrl } = handleReservationResult(result);

    if (success) cache.invalidate('/home');
    res.redirect(redirectUrl);
  } catch (error) {
    //console.log(`ReservationController::createReservation: ${error}`);
    res.redirect(`/home?success=false&message=${GENERAL_ERROR}`);
  }
};

//DELETE /reservation/:id/delete/
const deleteReservation = async (req, res) => {
  try {
    const result = await cancelReservation(
      req.session.jwtToken,
      parseInt(req.params.id)
    );
    const { success, redirectUrl } = handleCancellationResult(result);
    if (success) cache.invalidate('/home');
    res.redirect(redirectUrl);
  } catch (error) {
    //console.log(`ReservationController::deleteReservation: ${error}`);
    res.redirect(`/home?success=false&message=${GENERAL_ERROR}`);
  }
};

//GET /reservation/new/
const newReservation = async (req, res) => {
  const roomIds = await getListOfRoomIds(req.session.jwtToken);
  res.render('reservation/new', { title: 'NEW - MAKE RESERVATION', roomIds });
};

export default { deleteReservation, createReservation, newReservation };
