import { DIMENSIONS } from '../actions/actionsTypes';

const initialState = {
	window: null,
	screen: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case DIMENSIONS.WINDOW:
			return {
				...state,
				window: action.window
			};
		case DIMENSIONS.SCREEN:
			return {
				...state,
				screen: action.screen
			};
		default:
			return state;
	}
}
