import React from 'react';
import {
	StyleSheet, SafeAreaView, View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { connect } from 'react-redux';
import { Notifier } from 'react-native-notifier';

import Avatar from '../Avatar';
import { CustomIcon } from '../../lib/Icons';
import sharedStyles from '../../views/Styles';
import { themes } from '../../constants/colors';
import { withTheme } from '../../theme';
import { getUserSelector } from '../../selectors/login';
import { ROW_HEIGHT } from '../../presentation/RoomItem';
import { goRoom } from '../../utils/goRoom';
import Navigation from '../../lib/Navigation';

const AVATAR_SIZE = 48;
const BUTTON_HIT_SLOP = {
	top: 12, right: 12, bottom: 12, left: 12
};

const styles = StyleSheet.create({
	container: {
		height: ROW_HEIGHT,
		paddingHorizontal: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	content: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	inner: {
		flex: 1
	},
	avatar: {
		marginRight: 10
	},
	roomName: {
		fontSize: 17,
		lineHeight: 20,
		...sharedStyles.textMedium
	},
	message: {
		fontSize: 14,
		lineHeight: 17,
		...sharedStyles.textRegular
	},
	close: {
		marginLeft: 10
	}
});


class NotifierComponent extends React.Component {
	static propTypes = {
		baseUrl: PropTypes.string,
		user: PropTypes.object,
		notification: PropTypes.object,
		theme: PropTypes.string,
		isMasterDetail: PropTypes.bool
	}

	goRoom = () => {
		const {
			notification, isMasterDetail
		} = this.props;
		const { payload } = notification;
		const { rid, type, prid } = payload;
		if (!rid) {
			return;
		}
		const name = type === 'd' ? payload.sender.username : payload.name;
		// if sub is not on local database, title will be null, so we use payload from notification
		const { title = name } = notification;
		const item = {
			rid, name: title, t: type, prid
		};

		if (isMasterDetail) {
			Navigation.navigate('DrawerNavigator');
		}
		goRoom({ item, isMasterDetail });
		this.hideNotification();
	}

	hideNotification = () => Notifier.hideNotification()

	render() {
		const {
			baseUrl, user: { id: userId, token }, notification, theme
		} = this.props;
		const { text, payload } = notification;
		const { type } = payload;
		const name = type === 'd' ? payload.sender.username : payload.name;
		// if sub is not on local database, title and avatar will be null, so we use payload from notification
		const { title = name, avatar = name } = notification;

		return (
			<SafeAreaView>
				<View style={[
					styles.container,
					{
						backgroundColor: themes[theme].focusedBackground,
						borderColor: themes[theme].separatorColor
					}
				]}
				>
					<Touchable
						style={styles.content}
						onPress={this.goRoom}
						hitSlop={BUTTON_HIT_SLOP}
						background={Touchable.SelectableBackgroundBorderless()}
					>
						<>
							<Avatar text={avatar} size={AVATAR_SIZE} type={type} baseUrl={baseUrl} style={styles.avatar} userId={userId} token={token} />
							<View style={styles.inner}>
								<Text style={[styles.roomName, { color: themes[theme].titleText }]} numberOfLines={1}>{title}</Text>
								<Text style={[styles.message, { color: themes[theme].titleText }]} numberOfLines={1}>{text}</Text>
							</View>
						</>
					</Touchable>
					<TouchableOpacity onPress={this.hideNotification} hitSlop={BUTTON_HIT_SLOP}>
						<CustomIcon name='Cross' style={[styles.close, { color: themes[theme].titleText }]} size={20} />
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = state => ({
	user: getUserSelector(state),
	baseUrl: state.server.server,
	isMasterDetail: state.app.isMasterDetail
});

export default connect(mapStateToProps)(withTheme(NotifierComponent));
