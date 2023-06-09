import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { signInUser } from '../redux/auth/authOperations';

import {
  btnShowHideReducer,
  formReducer,
  initStateBtnShowHide,
  initStateSignIn,
} from '../Servises/reducer';
import ImageBackgroundComponent from '../Components/ImageBackground';
import Button from '../Components/Button';
import ButtonShowHide from '../Components/ButtonShowHide';
import ContainerButtonText from '../Components/ContainerButtonText';

const LoginScreen = () => {
  const [stateForm, dispatchForm] = useReducer(formReducer, initStateSignIn);

  const [stateShowHide, dispatchShowHide] = useReducer(
    btnShowHideReducer,
    initStateBtnShowHide
  );

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [inputName, setInputName] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
      setIsShowKeyboard(true);
    });
    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      setIsShowKeyboard(false);
    });
    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, []);

  const formSubmit = () => {
    dispatch(signInUser(stateForm));

    dispatchForm({ type: 'email', payload: '' });
    dispatchForm({ type: 'password', payload: '' });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ImageBackgroundComponent>
          <KeyboardAvoidingView style={styles.wrapper} behavior="height">
            <View style={styles.form}>
              <Text style={styles.title}>Sign in</Text>

              <TextInput
                style={inputName === 'email' ? inputOnFocus : styles.input}
                autoComplete="off"
                onChangeText={(value) =>
                  dispatchForm({ type: 'email', payload: value })
                }
                placeholder="Email Address"
                placeholderTextColor="#BDBDBD"
                cursorColor="#212121"
                value={stateForm.email}
                onFocus={() => setInputName('email')}
                onBlur={() => setInputName('')}
              />
              <View
                style={[
                  { marginBottom: !isShowKeyboard ? 43 : 32 },
                  { position: 'relative' },
                ]}
              >
                <TextInput
                  style={inputName === 'password' ? inputOnFocus : styles.input}
                  autoComplete="off"
                  onChangeText={(value) =>
                    dispatchForm({ type: 'password', payload: value })
                  }
                  placeholder="Password"
                  placeholderTextColor="#BDBDBD"
                  cursorColor="#212121"
                  value={stateForm.password}
                  secureTextEntry={stateShowHide.passwordVisibility}
                  onFocus={() => setInputName('password')}
                  onBlur={() => setInputName('')}
                />
                <ButtonShowHide
                  onPress={() =>
                    dispatchShowHide({
                      type: 'passwordVisibility',
                      payload: !stateShowHide.passwordVisibility,
                    })
                  }
                  name={stateShowHide.btnShowHide}
                />
              </View>
              {!isShowKeyboard && (
                <>
                  <Button onPress={formSubmit} name="Sign In" />
                  <ContainerButtonText
                    question="Don't have an account?"
                    name="Register"
                    screen="Registration"
                  />
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </ImageBackgroundComponent>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  form: {
    position: 'relative',
    paddingTop: 32,
    paddingHorizontal: 16,

    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    marginBottom: 32,

    color: '#212121',

    fontFamily: 'Roboto-medium',
    fontStyle: 'normal',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  input: {
    height: 50,
    marginBottom: 16,
    padding: 16,

    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,

    fontFamily: 'Roboto-regular',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
  },
  inputOnFocus: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6C00',
  },
});
const inputOnFocus = StyleSheet.compose(styles.input, styles.inputOnFocus);
