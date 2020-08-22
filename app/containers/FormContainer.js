import React from 'react';
import {
	ScrollView, StyleSheet, View, TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';

import { themes } from '../constants/colors';
import sharedStyles from '../views/Styles';
import scrollPersistTaps from '../utils/scrollPersistTaps';
import KeyboardView from '../presentation/KeyboardView';
import StatusBar from './StatusBar';
import AppVersion from './AppVersion';
import { isTablet } from '../utils/deviceInfo';
import SafeAreaView from './SafeAreaView';

const styles = StyleSheet.create({
	scrollView: {
		minHeight: '100%'
	}
});

export const FormContainerInner = ({ children, onPress }) => (
	<TouchableWithoutFeedback onPress={onPress}>
		<View style={[sharedStyles.container, isTablet && sharedStyles.tabletScreenContent]}>
			{children}
		</View>
	</TouchableWithoutFeedback>
);

const FormContainer = ({ children, theme, testID }) => (
	<KeyboardView
		style={{ backgroundColor: themes[theme].backgroundColor }}
		contentContainerStyle={sharedStyles.container}
		keyboardVerticalOffset={128}
	>
		<StatusBar theme={theme} />
		<ScrollView {...scrollPersistTaps} style={sharedStyles.container} contentContainerStyle={[sharedStyles.containerScrollView, styles.scrollView]}>
			<SafeAreaView testID={testID} theme={theme} style={{ backgroundColor: themes[theme].backgroundColor }}>
				{children}
				<AppVersion theme={theme} />
			</SafeAreaView>
		</ScrollView>
	</KeyboardView>
);

FormContainer.propTypes = {
	theme: PropTypes.string,
	testID: PropTypes.string,
	children: PropTypes.element,
	onPress: PropTypes.func
};

FormContainerInner.propTypes = {
	children: PropTypes.element,
	onPress: PropTypes.func
};

export default FormContainer;
