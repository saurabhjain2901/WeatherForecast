import React, { Component } from 'react';
import {
    Text,
    View,
    DeviceEventEmitter,
    FlatList
} from 'react-native';

import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from '@react-native-community/geolocation';
import Loader from '../Loading/Loader'
import  API from 'apisauce'

const baseURL = "http://api.openweathermap.org"

const ApiCall = API.create({ baseURL: baseURL })

export default class HomeScreenFour extends Component {
    state = {
        latitude: 0.0,
        longitude: 0.0,
        isLoading: false,
        data: null,
        city: '',
        tempInCity: 273.15
    };

    getDay = (_date) => {
        const date = new Date(_date);
        const day1 = date.getDay();
        let day;
        switch(day1){
            case 0:
                day = 'Sunday'
                break;
            case 1:
                day = 'Monday'
                break;
            case 2:
                day = 'Tuesday'
                break;
            case 3:
                day = 'Wednesday'
                break;
            case 4:
                day = 'Thursday'
                break;
            case 5:
                day = 'Friday'
                break;
            case 6:
                day = 'Saturday'
                break;
            default:
                break;
        }

        console.log(day)
        return <View>
                <Text style={{ fontSize: 18}}>{day}</Text>
            </View>
    }

    convertKelvinInCelcius = (temperature) => {
        const tempInCelcius = (temperature - 273.15).toFixed(0)
        return <Text>{tempInCelcius}</Text>
    }

    _handleGet = (lat, lon) => {
        console.log('_handleGet', lat, lon)
        let url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=a50f8c510854a2f2ac53593e16731612"
        ApiCall.get(url)
        .then(response => {
            console.log(response)
            var first = response.data.list[0]
            this.setState({ data: response.data.list, city: response.data.city, tempInCity: first.main.temp })
            console.log(this.state.data)
        })
        .catch(error => {
            console.log(error)
        })
    }

    componentDidMount() {
        var that =this;
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: true, 
            showDialog: true,
            openLocationServices: true, 
            preventOutSideTouch: false,
            preventBackClick: false, 
            providerListener: true 
        }).then(function(success) {
                that.callLocation(that);
            }.bind(this)
        ).catch((error) => {
            console.log(error.message);
        });
        
        DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { 
            console.log(status); 
        });
    }
    
    componentWillUnmount() {
        LocationServicesDialogBox.stopListener(); 
        Geolocation.clearWatch(this.watchID);
    } 

    callLocation(that){
        this.setState({ isLoading: true })
          Geolocation.getCurrentPosition(
             (position) => {
                this.setState({ isLoading: false })
                const currentLongitude = JSON.stringify(position.coords.longitude);
                const currentLatitude = JSON.stringify(position.coords.latitude);
                that.setState({ longitude:currentLongitude });
                that.setState({ latitude:currentLatitude });
                this._handleGet(currentLatitude, currentLongitude)

             },
             (error) => {
                    this.setState({ isLoading: false })
                    alert(error.message)
                },
             { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
          );
          that.watchID = Geolocation.watchPosition((position) => {
              console.log(position);
              const currentLongitude = JSON.stringify(position.coords.longitude);
              const currentLatitude = JSON.stringify(position.coords.latitude);
             that.setState({ longitude:currentLongitude });
             that.setState({ latitude:currentLatitude });
          });
       }

    renderTemperatureList = ({ item, index }) => {
        console.log('helooooooooooo, i',index);
    return (
        <View key={index} style = {{ flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#f1f1f1', padding: 10, margin: 5  }}>            
            <View style={{ flex: 3 }}>
                {this.getDay(item. dt_txt)}
                <Text style={{ fontSize: 15 }}>{item.dt_txt}</Text>        
            </View>

            <View style={{ flex: 1 , justifyContent: 'center'}}>
                {this.convertKelvinInCelcius(item.main.temp)}
            </View>
        </View>
        );
    };

    render() {
        return (
            (this.state.isLoading)
            ?
                <Loader />
            :
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View  style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontSize: 36, alignSelf: 'center', margin: 10 }}>
                        {this.convertKelvinInCelcius(this.state.tempInCity)}
                    </Text>
                    <Text style={{ fontSize: 24 }}>
                        {this.state.city.name}
                    </Text>
                   
                </View>

                <View  style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.renderTemperatureList}
                        keyExtractor={(category, index) => index.toString()}
                        contentContainerStyle={{ padding: 10, alignItems: 'stretch', backgroundColor: 'white'}}
                        />
                </View>
            </View>
        );
    }
}