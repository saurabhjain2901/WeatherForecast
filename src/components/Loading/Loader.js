//import liraries
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground} from 'react-native';

// create a component
const MyComponent = () => {
    return (
        <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: '#fff'}}>
            {/* <ActivityIndicator size="large" color="#0000ff" /> */}
            <View style = {{alignItems: 'center', justifyContent: 'center'}}>
                <ImageBackground source={require('../../../assets/splashy_loader.gif')} style={styles.Gif} />
                <Text style={{fontSize: 18}}>Getting Location...</Text>
            </View>           
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    Gif:{
        width:250,
        height:250,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'#fff',
    }
});

//make this component available to the app
export default MyComponent;
