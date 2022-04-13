import * as ActionTypes from "../constants/actionTypes";

export const storeNoticesOfDeparture = (payload) => ({
  type: ActionTypes.STORE_NOTICES_OF_DEPARTURE,
  payload,
});

export default storeNoticesOfDeparture;