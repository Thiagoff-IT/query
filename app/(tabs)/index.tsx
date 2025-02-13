import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Button, TextInput, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getPosts, createPost, updatePost, deletePost, Post } from '@/apiClient';

export default function TabOneScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      const newPost = await createPost({ userId: 1, title: newPostTitle, body: newPostBody });
      setPosts([newPost, ...posts]);
      setNewPostTitle('');
      setNewPostBody('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (editPostId === null) return;
    try {
      const updatedPost = await updatePost(editPostId, { title: editPostTitle, body: editPostBody });
      setPosts(posts.map(post => (post.id === editPostId ? updatedPost : post)));
      setEditPostId(null);
      setEditPostTitle('');
      setEditPostBody('');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostBody(post.body);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TextInput
        style={styles.input}
        placeholder="New Post Title"
        value={newPostTitle}
        onChangeText={setNewPostTitle}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="New Post Body"
        value={newPostBody}
        onChangeText={setNewPostBody}
        placeholderTextColor="#888"
        multiline
      />
      <Button title="Create Post" onPress={handleCreatePost} color="#007AFF" />
      {editPostId !== null && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Edit Post Title"
            value={editPostTitle}
            onChangeText={setEditPostTitle}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Edit Post Body"
            value={editPostBody}
            onChangeText={setEditPostBody}
            placeholderTextColor="#888"
            multiline
          />
          <Button title="Update Post" onPress={handleUpdatePost} color="#007AFF" />
        </>
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.body}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEditPost(item)} color="#007AFF" />
              <Button title="Delete" onPress={() => handleDeletePost(item.id)} color="#FF3B30" />
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  postContainer: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#FFF',
    width: '100%',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
