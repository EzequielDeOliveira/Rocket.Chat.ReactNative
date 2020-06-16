import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import equal from 'deep-equal';
import { NotifierRoot, Notifier, Easing } from 'react-native-notifier';
import { responsive } from 'react-native-responsive-ui';

import NotifierComponent from './NotifierComponent';
import EventEmitter from '../../utils/events';
import Navigation from '../../lib/Navigation';
import { getActiveRoute } from '../../utils/navigation';

const ANIMATION_DURATION = 300;
const NOTIFICATION_DURATION = 3000;
const LISTENER = 'NotificationInApp';

class NotificationBadge extends React.Component {
	static propTypes = {
		navigation: PropTypes.object,
		window: PropTypes.object,
		theme: PropTypes.string
	}

	componentDidMount() {
		EventEmitter.addEventListener(LISTENER, this.show);
	}

	// shouldComponentUpdate(nextProps) {
	// 	const { notification: nextNotification } = nextProps;
	// 	const {
	// 		notification: { payload }, window, theme
	// 	} = this.props;
	// 	if (nextProps.theme !== theme) {
	// 		return true;
	// 	}
	// 	if (!equal(nextNotification.payload, payload)) {
	// 		return true;
	// 	}
	// 	if (nextProps.window.width !== window.width) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	componentWillUnmount() {
		EventEmitter.removeListener(LISTENER);
	}

	show = (notification) => {
		const { navigation } = this.props;
		const { payload } = notification;
		const state = Navigation.navigationRef.current.getRootState();
		const route = getActiveRoute(state);
		if (payload.rid) {
			if (route?.name === 'RoomView' && route.params?.rid === payload.rid) {
				return;
			}
			Notifier.showNotification({
				showAnimationDuration: ANIMATION_DURATION,
				hideAnimationDuration: ANIMATION_DURATION,
				duration: NOTIFICATION_DURATION,
				showEasing: Easing.inOut(Easing.quad),
				Component: NotifierComponent,
				componentProps: {
					navigation,
					notification
				}
			});
		}
	}

	render() {
		return (
			<NotifierRoot />
		);
	}
}

export default responsive(NotificationBadge);
