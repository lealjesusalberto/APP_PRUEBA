import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, FlatList, Platform, ActivityIndicator, Image } from 'react-native';

export default class App extends Component
{
  constructor()
  {
      super();

      this.state =
      {
          loading: true,
          serverData: [],
          fetching_from_server: false
      }

      this.timer = -1;

      this.page = 0
  }

  componentDidMount()
  {
      this.page = this.page + 1;

      fetch('http://omdbapi.com/?apikey=5eec5adc&s=love&plot=full&y=2020&type=movie&page=' + this.page)
      .then((response) => response.json())
      .then((responseJson) =>
      {
          this.setState({ serverData: [ ...this.state.serverData, ...responseJson.Search ], loading: false });
      })
      
      .catch((error) =>
      {
        Alert.alert('Error al obtener listado. Intente nuevamente');
        console.error(error);
      });
  }

  loadMoreData = () =>
  {        
      this.page = this.page + 1;

      this.setState({ fetching_from_server: true }, () =>
      {
          clearTimeout(this.timer);

          this.timer = -1;

          this.timer = setTimeout(() =>
          {
              fetch('http://omdbapi.com/?apikey=5eec5adc&s=love&plot=full&y=2020&type=movie&page=' + this.page)
              .then((response) => response.json())
              .then((responseJson) =>
              {
                  this.setState({ serverData: [ ...this.state.serverData, ...responseJson.Search ], fetching_from_server: false });
              })
              .catch((error) =>
              {
                Alert.alert('Esperando nuevos resultados')
              });
          }, 1500);   
      });
  }

  renderFooter()
  {
    return (
        <View style = { styles.footer }>
            <TouchableOpacity activeOpacity = { 0.9 } onPress = { this.loadMoreData } style = { styles.loadMoreBtn }>
                <Text style = { styles.btnText }>Cargar Más</Text>
                {
                    ( this.state.fetching_from_server )
                    ?
                        <ActivityIndicator color = "white" style = {{ marginLeft: 8 }} />
                    :
                        null
                }
            </TouchableOpacity>                    
        </View>
    )
  }

  render()
    
  {
    return(
      <View style = { styles.container }>
      {
       (this.state.loading )
        
        ?
          ( <ActivityIndicator size = "large" />, 
          <Text style = {styles.preLoad}>Cargando Peliculas...</Text> )
        :
          (
              
              <FlatList
                style = {{ width: '100%' }}
                keyExtractor={(item, index) => index.toString()} 
                data = { this.state.serverData }
                renderItem = {({ item, index }) => 
                    <View style = { styles.item }>
                       <Text style= {styles.mainTitle}> {item.Title}</Text>
                       <Text style= {styles.movieYear}>Año: {item.Year}</Text>
                       <ImageBackground style={styles.posterMovie} source={{uri:item.Poster}}/>
                       <Text style= {styles.type}>Tipo: {item.Type}</Text>
                    </View>
                }
                ItemSeparatorComponent = {() => <View style = { styles.separator } /> }
                ListFooterComponent = { this.renderFooter.bind( this ) }
              />
          )
      }                
      </View>
    );
  }
}

const styles = StyleSheet.create(
{
  container:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ( Platform.OS === 'ios' )? 20 : 0
  },
  preLoad: {
      fontSize: 20
  },

  posterMovie:{
    width: '100%',
    height:400,
  },
  type: {
      fontSize: 18,
      paddingHorizontal: 5,
      paddingVertical: 5,
      width: 150
  },
  mainTitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom:20
  },
  movieYear: {
    fontSize: 18,
    color: '#ffffff'
  },

  item:
  {
    padding: 20,
    backgroundColor: '#044631',
    marginVertical: 5
  },

  separator:
  {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },

  text:
  {
    fontSize: 20,
    color: 'black'
  },

  footer:
  {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1.5,
    borderTopColor: 'black'
  },

  loadMoreBtn:
  {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  btnText:
  {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  }
});