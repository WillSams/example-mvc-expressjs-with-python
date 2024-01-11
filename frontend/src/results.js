import {
  CREATE_RESERVATION_FAILURE,
  CREATE_RESERVATION_SUCCESS,
  DELETE_RESERVATION_FAILURE,
  DELETE_RESERVATION_SUCCESS,
} from './constants.js';
import utils from './utils.js';

const generateRedirectUrl = (success, errors, successMessage, failureMessage) => {
  return success
    ? `/home?success=true&message=${successMessage}`
    : `/home?success=false&message=${failureMessage}  ${utils.mergeMessages('Errors', errors)}`;
};

const handleCancellationResult = (result) => {
  const successMsg = generateRedirectUrl(result.success, result.errors, DELETE_RESERVATION_SUCCESS, DELETE_RESERVATION_FAILURE,);
  return { success: result.success, redirectUrl: successMsg };
};

const handleReservationResult = (result) => {
  const successMsg = generateRedirectUrl(result.success, result.errors, CREATE_RESERVATION_SUCCESS, CREATE_RESERVATION_FAILURE,);
  return { success: result.success, redirectUrl: successMsg };
};

export { handleCancellationResult, handleReservationResult };
