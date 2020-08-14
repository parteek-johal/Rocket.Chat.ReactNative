import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RNUserDefaults from 'rn-user-defaults';
import { ScrollView, Text } from 'react-native';

import { E2E_RANDOM_PASSWORD_KEY } from '../lib/encryption/constants';
import { CloseModalButton } from '../containers/HeaderButton';
import scrollPersistTaps from '../utils/scrollPersistTaps';
import SafeAreaView from '../containers/SafeAreaView';
import StatusBar from '../containers/StatusBar';
import { themes } from '../constants/colors';
import Button from '../containers/Button';
import { withTheme } from '../theme';
import I18n from '../i18n';

class E2ESavePasswordView extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: () => <CloseModalButton navigation={navigation} testID='e2e-save-password-view-close' />,
		title: I18n.t('Save_Your_E2E_Password')
	})

	static propTypes = {
		server: PropTypes.string,
		navigation: PropTypes.object,
		theme: PropTypes.string
	}

	constructor(props) {
		super(props);
		this.mounted = false;
		this.state = { password: '' };
		this.init();
	}

	componentDidMount() {
		this.mounted = true;
	}

	init = async() => {
		const { server } = this.props;
		try {
			const password = await RNUserDefaults.get(`${ server }-${ E2E_RANDOM_PASSWORD_KEY }`);
			if (this.mounted) {
				this.setState({ password });
			} else {
				this.state.password = password;
			}
		} catch {
			// Do nothing
		}
	}

	onSaved = async() => {
		const { navigation, server } = this.props;
		try {
			await RNUserDefaults.clear(`${ server }-${ E2E_RANDOM_PASSWORD_KEY }`);
		} catch {
			// Do nothing
		}
		navigation.pop();
	}

	render() {
		const { password } = this.state;
		const { theme } = this.props;
		return (
			<SafeAreaView
				style={{ backgroundColor: themes[theme].backgroundColor }}
				testID='e2e-save-password-view'
				theme={theme}
			>
				<StatusBar theme={theme} />
				<ScrollView
					contentContainerStyle={[
						{
							backgroundColor: themes[theme].backgroundColor,
							borderColor: themes[theme].separatorColor
						}
					]}
					{...scrollPersistTaps}
				>
					<Text>{password}</Text>
					<Button
						style={{ backgroundColor: themes[theme].auxiliaryBackground }}
						title='How It Works'
						type='secondary'
						theme={theme}
					/>
					<Button
						onPress={this.onSaved}
						title='I Saved My E2E Password'
						theme={theme}
					/>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = state => ({
	server: state.server.server
});
export default connect(mapStateToProps)(withTheme(E2ESavePasswordView));
