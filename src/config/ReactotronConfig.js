import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // <--- BEST PRACTICE: Put this first!
  .configure({name: 'BlueKite App'})
  .useReactNative({
    asyncStorage: true,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: {veto: stackFrame => false},
    overlay: false,
  })
  .use(reactotronRedux())
  .connect();

export default reactotron;
