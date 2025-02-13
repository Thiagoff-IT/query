import React, { useEffect } from 'react';
import { StyleSheet, FlatList, Button, TextInput, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost, Post } from '@/apiClient';
import { useState } from 'react';


export default function TabTwoScreen() {
  const queryClient = useQueryClient();
  const { data: posts, error, isLoading, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 0, // garante que os dados fiquem "podres" imediatamente
    refetchOnWindowFocus: true,
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      console.log("Post criado:", data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      refetch(); // forçando atualização
    },
    onError: (error) => console.error("Erro ao criar post:", error),
  });
  const updatePostMutation = useMutation({
    mutationFn: (post: { id: number; title: string; body: string }) => updatePost(post.id, post),
    onSuccess: (data) => {
      console.log("Post atualizado:", data);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      refetch();
    },
    onError: (error) => console.error("Erro ao atualizar post:", error),
  });
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      console.log("Post deletado com sucesso");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      refetch();
    },
    onError: (error) => console.error("Erro ao deletar post:", error),
  });

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');

  const handleCreatePost = () => {
    createPostMutation.mutate({ userId: 1, title: newPostTitle, body: newPostBody });
    setNewPostTitle('');
    setNewPostBody('');
  };

  const handleUpdatePost = () => {
    if (editPostId === null) return;
    updatePostMutation.mutate({ id: editPostId, title: editPostTitle, body: editPostBody });
    setEditPostId(null);
    setEditPostTitle('');
    setEditPostBody('');
  };

  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

  const handleEditPost = (post: Post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostBody(post.body);
  };

  useEffect(() => {
    console.log("Dados dos posts atualizados:", posts);
  }, [posts]);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading posts</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
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
