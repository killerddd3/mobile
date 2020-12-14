import './src'
import KeyboardManager from 'react-native-keyboard-manager'
import { LogBox } from 'react-native'

KeyboardManager.setEnableAutoToolbar(false)

LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
	'POP_TO_TOP'
])