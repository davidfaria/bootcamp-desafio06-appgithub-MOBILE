import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

const Repository = ({ navigation }) => {
  console.tron.log(navigation, 'aqui');

  return (
    <WebView
      source={{ uri: navigation.state.params.url }}
      style={{ flex: 1 }}
    />
  );
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.name,
});

export default Repository;
