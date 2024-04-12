import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';




import { MainStackNavigator, ToDoListStackNavigator } from './StackNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator

      screenOptions={{ headerShown: false }}
      barStyle={{ backgroundColor: '#694fad' }}>
      <Tab.Screen
        name="HomeScreen"
        options={{
          title: 'Tab Squirtle',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
        component={MainStackNavigator}
      />
      <Tab.Screen
        name="TodoListScreen"
        options={{ title: 'Tab Todo List',  
        tabBarIcon: ({size}) => (
          <AntDesign name="checkcircle" size={24}  />
        )
 
 
      }
      
      }
        component={ToDoListStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
