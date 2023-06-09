import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { selectUserId, selectUserLogin } from '../redux/auth/authSelectors';

import ImageBackgroundComponent from '../Components/ImageBackground';
import UserImageProfile from '../Components/UserImageProfile';
import ImageItem from '../Components/ImageItem';
import ButtonLogOut from '../Components/ButtonLogOut';

const ProfileScreen = () => {
  const userLogin = useSelector(selectUserLogin);
  const userId = useSelector(selectUserId);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = () => {
    onSnapshot(
      query(collection(db, 'posts'), where('userId', '==', userId)),
      (data) => {
        setUserPosts(
          data.docs.map((doc) => ({ ...doc.data(), postId: doc.id }))
        );
      }
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackgroundComponent>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.userProfile}>
            <UserImageProfile />

            <ButtonLogOut style={styles.btnLogOut} />
            <Text style={styles.title}>{userLogin}</Text>
            <FlatList
              data={userPosts}
              keyExtractor={(item) => item.postId}
              renderItem={({ item }) => (
                <ImageItem post={item} screen="Profile" />
              )}
            />
          </View>
        </View>
      </ImageBackgroundComponent>
    </View>
  );
};
export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userProfile: {
    position: 'relative',

    height: '80%',
    paddingTop: 92,
    paddingBottom: 90,
    paddingHorizontal: 16,

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  btnLogOut: {
    position: 'absolute',
    top: 22,
    right: 16,
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
});
