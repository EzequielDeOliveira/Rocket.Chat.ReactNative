import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import EmojiPicker from '../../containers/EmojiPicker';
import styles from './styles';
import { isAndroid } from '../../utils/deviceInfo';
import { withSplit } from '../../split';

const margin = isAndroid ? 40 : 20;
const maxSize = 400;

class ReactionPicker extends React.Component {
	static propTypes = {
		baseUrl: PropTypes.string.isRequired,
		message: PropTypes.object,
		show: PropTypes.bool,
		reactionClose: PropTypes.func,
		onEmojiSelected: PropTypes.func,
		split: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number
	};

	shouldComponentUpdate(nextProps) {
		const {
			show, width, height, split
		} = this.props;
		return nextProps.show !== show || width !== nextProps.width || height !== nextProps.height || nextProps.split !== split;
	}

	onEmojiSelected = (emoji, shortname) => {
		// standard emojis: `emoji` is unicode and `shortname` is :joy:
		// custom emojis: only `emoji` is returned with shortname type (:joy:)
		// to set reactions, we need shortname type
		const { onEmojiSelected, message } = this.props;
		onEmojiSelected(shortname || emoji, message.id);
	}

	render() {
		const {
			width, height, show, baseUrl, reactionClose, split
		} = this.props;

		let widthStyle = width - margin;
		let heightStyle = Math.min(width, height) - (margin * 2);
		if (split) {
			widthStyle = maxSize;
			heightStyle = maxSize;
		}

		return (show
			? (
				<Modal
					isVisible={show}
					style={{ alignItems: 'center' }}
					onBackdropPress={reactionClose}
					onBackButtonPress={reactionClose}
					animationIn='fadeIn'
					animationOut='fadeOut'
				>
					<View
						style={[
							styles.reactionPickerContainer,
							{
								width: widthStyle,
								height: heightStyle
							}
						]}
						testID='reaction-picker'
					>
						<EmojiPicker
							// tabEmojiStyle={tabEmojiStyle}
							onEmojiSelected={this.onEmojiSelected}
							baseUrl={baseUrl}
						/>
					</View>
				</Modal>
			)
			: null
		);
	}
}

const mapStateToProps = state => ({
	baseUrl: state.server.server
});

export default connect(mapStateToProps)(withSplit(ReactionPicker));
