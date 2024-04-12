import React from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList, TouchableOpacity, Modal, Alert, Pressable, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoItem from '../types/TodoItem';
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const storageTodoListKey = '@todo-list-key'

const RenderItem = ({
  todoItem,
  onDelete,
}: {
  todoItem: TodoItem
  onDelete: (item: TodoItem) => void
}) => {
  const renderRightActions = (progress: any, dragX: any) => {
    return (
      <View style={styles.rightAction}>
        <TouchableOpacity onPress={() => onDelete(todoItem)}>
          <AntDesign name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.item}>
        <Text style={styles.itemText} numberOfLines={1} selectable>
          {todoItem.description}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
}


const TodoListScreen = ({ navigation }) => {
  const [todoItemList, setTodoItemList] = React.useState<TodoItem[]>([])
  const [todoItemDescription, setTodoItemDescription] = React.useState('')
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <AntDesign name="pluscircle" size={24} color="black" onPress={() => setModalVisible(true)} />
        //   <Pressable
        //   style={[styles.button, styles.buttonOpen]}
        //   onPress={() => setModalVisible(true)}>
        //   <Text style={styles.textStyle}>Show Modal</Text>
        // </Pressable>
      ),

    }

    );
  }, [navigation]);



  React.useEffect(() => {
    const getTodoItems = async () => {
      const savedItems = await AsyncStorage.getItem(storageTodoListKey)
      if (savedItems === null) {
        return
      }
      const items = JSON.parse(savedItems) || []
      setTodoItemList(items)
    }
    getTodoItems()
  }, [])

  const handleAddItem = async () => {
    if (!todoItemDescription) {
      alert('Descrição da tarefa inválida!')
      return
    }

    if (!todoItemList.length) {
      const arrTodo = [
        {
          id: 1,
          title: '',
          description: todoItemDescription,
        },
      ]
      await AsyncStorage.setItem(storageTodoListKey, JSON.stringify(arrTodo))

      setTodoItemList(arrTodo)
      setTodoItemDescription('')
      return
    }

    const todoItemListCopy = [...todoItemList]

    const lastItemIdPlusOne = todoItemList[todoItemList.length - 1].id + 1

    const newItem: TodoItem = {
      id: lastItemIdPlusOne,
      title: '',
      description: todoItemDescription,
    }

    todoItemListCopy.push(newItem)

    await AsyncStorage.setItem(
      storageTodoListKey,
      JSON.stringify(todoItemListCopy)
    )

    setTodoItemList(todoItemListCopy)
    setTodoItemDescription('')
  }

  const handleDeleteItem = (item: TodoItem) => {
    const index = todoItemList.findIndex((todo) => todo.id === item.id)

    const todoItemListCopy = todoItemList.toSpliced(index, 1)

    setTodoItemList(todoItemListCopy)
    AsyncStorage.setItem(storageTodoListKey, JSON.stringify(todoItemListCopy))
  }

  

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>

        <View style={styles.centeredView}>

          <View style={[styles.modalView, { justifyContent: 'flex-end' }]}>

        <AntDesign name="closecircle" size={24} color="black" onPress={() => setModalVisible(!modalVisible)} />
              {/* <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable> */}

            <br />

            <TextInput
              style={styles.input}
              placeholder="Descrição da Tarefa"
              value={todoItemDescription}
              onChangeText={setTodoItemDescription}
            />

            <Button title="Adicionar Tarefa" onPress={handleAddItem} />
          </View>
        </View>
      </Modal>

      
      {/* <TextInput
        style={styles.input}
        placeholder="Descrição da Tarefa"
        value={todoItemDescription}
        onChangeText={setTodoItemDescription}
      />
      <Button title="Adicionar Tarefa" onPress={handleAddItem} /> */}
      
      <FlatList
        style={{ width: '100%' }}
        data={todoItemList}
        renderItem={({ item }) => 
          <RenderItem todoItem={item} onDelete={handleDeleteItem} />
        }
        contentContainerStyle={{ gap: 5, marginTop: 5 }}
        keyExtractor={(item, i) => (item.id ?? i).toString()}
      />
    
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  item: {
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold'
  },
  itemText: {
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    paddingVertical: 16,
  },
});

export default TodoListScreen;
