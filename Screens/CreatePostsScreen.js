import React, { useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { selectUserId, selectUserLogin } from '../redux/auth/authSelectors';
import { Feather } from '@expo/vector-icons';

import { formReducer, initStateCreatePosts } from '../Servises/reducer';
import CameraComponent from '../Components/Camera';
import Button from '../Components/Button';
import ButtonText from '../Components/ButtonText';
import ButtonOrangeOval from '../Components/ButtonOrangeOval';
import IconLocation from '../Components/IconLocation';
import {
  uploadPostToServerWithCoords,
  uploadPostToServerWithoutCoords,
} from '../Servises/uploadServerFunctions';

const CreatePostsScreen = ({ navigation }) => {
  const [state, dispatchForm] = useReducer(formReducer, initStateCreatePosts);
  const [image, setImage] = useState(null);
  const [inputName, setInputName] = useState('');

  const isFocused = useIsFocused();

  const userId = useSelector(selectUserId);
  const userLogin = useSelector(selectUserLogin);

  const publishPhoto = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      const options = {
        userId,
        userLogin,
        image,
        name: state.name,
        location: state.location,
        nameStorage: 'images',
      };
      uploadPostToServerWithoutCoords(options);
      setImage(null);
      navigation.navigate('Posts');
      return;
    }
    let location = await Location.getCurrentPositionAsync();

    const options = {
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      userId,
      userLogin,
      image,
      name: state.name,
      location: state.location,
      nameStorage: 'images',
    };

    uploadPostToServerWithCoords(options);
    setImage(null);
    navigation.navigate('Posts');
  };

  const deletePhoto = () => {
    setImage(null);
    navigation.navigate('Posts');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {isFocused && <CameraComponent image={image} onPress={setImage} />}
        <ButtonText style={{ marginBottom: 32 }}>
          <Text style={styles.textEditBtn}>Edit photo</Text>
        </ButtonText>
        <View>
          <TextInput
            style={inputName === 'name' ? inputOnFocus : styles.input}
            autoComplete="off"
            onChangeText={(value) =>
              dispatchForm({ type: 'name', payload: value })
            }
            placeholder="Name photo"
            placeholderTextColor="#BDBDBD"
            cursorColor="#212121"
            value={state.name}
            onFocus={() => setInputName('name')}
            onBlur={() => setInputName('')}
          />
          <View style={styles.containerInputLocation}>
            <TextInput
              style={
                inputName === 'location' ? inputOnFocusLocation : inputLocation
              }
              autoComplete="off"
              onChangeText={(value) =>
                dispatchForm({ type: 'location', payload: value })
              }
              placeholder="Location"
              placeholderTextColor="#BDBDBD"
              cursorColor="#212121"
              value={state.location}
              onFocus={() => setInputName('location')}
              onBlur={() => setInputName('')}
            />

            <IconLocation style={styles.markLocation} />
          </View>
          <Button image={image} name="Publish" onPress={publishPhoto} />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonOrangeOval image={image} onPress={deletePhoto}>
            <Feather
              name="trash-2"
              size={24}
              color={image === null ? '#BDBDBD' : '#ffffff'}
            />
          </ButtonOrangeOval>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 24,
    paddingBottom: 34,
    paddingHorizontal: 16,

    backgroundColor: '#FFFFFF',
  },
  textEditBtn: {
    color: '#BDBDBD',

    fontFamily: 'Roboto-regular',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 1.5,
  },
  input: {
    height: 50,
    marginBottom: 16,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#BDBDBD',

    color: '#212121',

    fontFamily: 'Roboto-medium',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 19,
  },
  containerInputLocation: {
    position: 'relative',
    marginBottom: 32,
  },
  inputLocation: {
    marginBottom: 0,
    paddingLeft: 28,
  },
  markLocation: {
    position: 'absolute',
    left: 0,
    top: 6,
  },
  inputOnFocus: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6C00',
  },
  btnTrash: {
    marginTop: 120,
  },
  buttonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
});
const inputLocation = StyleSheet.compose(styles.input, styles.inputLocation);
const inputOnFocus = StyleSheet.compose(styles.input, styles.inputOnFocus);
const inputOnFocusLocation = StyleSheet.compose(
  inputLocation,
  styles.inputOnFocus
);
