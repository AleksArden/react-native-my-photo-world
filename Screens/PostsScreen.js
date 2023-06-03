import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image, Text } from 'react-native';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

import ImageItem from '../Components/ImageItem';
import UserImage from '../assets/images/Rectangle-22.jpg';
import { useSelector } from 'react-redux';
import { selectUserEmail, selectUserLogin } from '../redux/auth/authSelectors';

const PostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const userLogin = useSelector(selectUserLogin);
  const userEmail = useSelector(selectUserEmail);

  const getAllPosts = () => {
    onSnapshot(collection(db, 'posts'), (data) => {
      setPosts(data.docs.map((doc) => ({ ...doc.data(), postId: doc.id })));
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image style={styles.image} source={UserImage} resizeMode="cover" />
        <View style={styles.wrapper}>
          <Text style={styles.login}>{userLogin}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId}
        renderItem={({ item }) => <ImageItem post={item} />}
      />
    </View>
  );
};
export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  userContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 60,
    height: 60,
  },
  wrapper: {
    marginLeft: 8,
  },
  login: {
    fontFamily: 'Roboto-medium',
    fontStyle: 'normal',
    fontSize: 13,
    lineHeight: 15,

    color: '#212121',
  },
  email: {
    fontFamily: 'Roboto-regular',
    fontStyle: 'normal',
    fontSize: 11,
    lineHeight: 13,

    color: 'rgba(33, 33, 33, 0.8)',
  },
});
