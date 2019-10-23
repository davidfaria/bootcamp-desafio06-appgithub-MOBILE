import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnnerAvatar,
  Info,
  Title,
  Auhtor,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: false,
      page: 1,
      loadMore: true,
      refreshing: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    await this.loadStars(user);
  }

  async loadStars(user, pageNumber = 1, shouldRefresh = false) {
    console.tron.log('call loadStars');

    const { loadMore, stars } = this.state;

    console.tron.log('loadMore', loadMore);

    if (!loadMore) return;

    try {
      this.setState({
        loading: true,
      });
      // console.tron.log('page: ', pageNumber);
      const res = await api.get(`/users/${user.login}/starred`, {
        params: {
          page: pageNumber,
          // per_page: 5,
        },
      });

      // console.tron.log('Result: ', res.data);
      const isLoadMore = res.data.length > 0;

      this.setState({
        stars: shouldRefresh ? res.data : [...stars, ...res.data],
        loadMore: isLoadMore,
        page: pageNumber + 1,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  async refreshList(user) {
    // const { loadMore } = this.state;

    this.setState({
      refreshing: true,
    });
    await this.loadStars(user, 1, true);
    this.setState({
      refreshing: false,
    });
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.login}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          onRefresh={() => this.refreshList(user)} // Função dispara quando o usuário arrasta a lista pra baixo
          refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
          onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
          onEndReached={() => this.loadStars(user, page)}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Repository', {
                  name: item.name,
                  url: item.owner.html_url,
                });
              }}
            >
              <Starred>
                <OwnnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Auhtor>{item.owner.login}</Auhtor>
                </Info>
              </Starred>
            </TouchableOpacity>
          )}
        />
        {loading && !refreshing && <ActivityIndicator size={32} />}
      </Container>
    );
  }
}
