import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation'

class LawBoard extends React.Component{

  constructor(){
    super();
    this.state = {
      data: [1,2,3]
    }
  }

  componentDidMount(){
    this.getData()
  }
  
  getData = async () => { 
    const url = 'https://jsonplaceholder.typicode.com/albums?_limit=20';
    fetch(url).then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        data:responseJson
      })
    })
  }

  _renderItem = ({item}) => {
    return(
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.id}</Text>
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    )
  }

  render(){
    return(
      <FlatList
        style={styles.container}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={(item,index)=>index.toString()}
        horizontal={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
  },
  item: {
    borderBottomColor:"ccc",
    borderBottomWidth:1,
    marginBottom:10
  },
  itemImage:{
    width:'100%',
    height:200,
    resizeMode:'cover'
  },
  itemText:{
    fontSize:16,
    padding:5
  }
  });

export default withNavigation(LawBoard);