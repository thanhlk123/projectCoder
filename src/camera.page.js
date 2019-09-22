import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';
import workScreen from './workScreen'
import styles from './styles';
import Popup from './popup';
import ScanPreview from './scanPreview';

import imageScreen from './imageScreen';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class CameraPage extends React.Component  {
    camera = null;

    state = {
        captures: [],
        // setting flash to be turned off by default
        flashMode: Camera.Constants.FlashMode.off,
        capturing: null,
        // start the back camera by default
        autoFocus:Camera.Constants.AutoFocus.on,
        cameraType: Camera.Constants.Type.back,
        hasCameraPermission: null,
        toolbar:true,
        dataResponse:[],
        uri:""
      
    };

    setFlashMode = (flashMode) => this.setState({ flashMode });
    setCameraType = (cameraType) => this.setState({ cameraType });
    handleCaptureIn = () => this.setState({ capturing: true });

    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };
    handleOK = () => {
      var date = new Date().getDate(); 
      var month = new Date().getMonth() + 1; 
      var year = new Date().getFullYear(); 
      var hours = new Date().getHours(); 
      var min = new Date().getMinutes(); 
          sec = new Date().getSeconds(); 
        date = date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;
        data={"uri":this.state.uri,"date":date}
        console.log(this.state.captures.length)
        if (this.state.captures.length==2){
          this.props.navigation.navigate('work',{'uri':this.state.uri})
        }
        if (this.state.captures.length==1){
          this.setState ({
            captures: [data, ...this.state.captures],
            toolbar:true,
            cameraType: Camera.Constants.Type.front
          })}  
        else {
        
        this.setState ({
          captures: [data, ...this.state.captures],
          toolbar:true
        }) }
    }
    handleRemove = ()=>{
      this.setState ({
        uri:"",
        toolbar:true
      })
    }

    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        this.setState({ 
          capturing: false, 
          uri: photoData.uri,
          toolbar:false })
    };

    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
    };


    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

        this.setState({ hasCameraPermission });
    };

    render() {
      const { hasCameraPermission, autoFocus, flashMode, cameraType, capturing, captures, toolbar } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }
        else if(toolbar==false){
          return(<React.Fragment >
            <View style= {{flex:1,backgroundColor:'#255137'}}>
              <View style={{height:24,backgroundColor:'green'}}/>
              <View>
                  <Image source={{uri: this.state.uri}} style={styles.preview}></Image>
              </View>
              {captures.length > 0 && <Gallery captusres={captures} gotoImages={this.props.navigation.navigate} />}
              <Toolbar 
                  capturing={capturing}
                  flashMode={flashMode}
                  cameraType={cameraType}
                  setFlashMode={this.setFlashMode}
                  setCameraType={this.setCameraType}
                  onCaptureIn={this.handleCaptureIn}
                  onCaptureOut={this.handleCaptureOut}
                  onLongCapture={this.handleLongCapture}
                  onShortCapture={this.handleShortCapture}
                  styleToolbar={this.state.toolbar}
                  onOk={this.handleOK}
                  onRemove={this.handleRemove}
              />
              </View>
          </React.Fragment>)
        }

        return (
            <React.Fragment >
              <View style= {{flex:1,backgroundColor:'#255137'}}>
                <View style={{height:24,backgroundColor:'green'}}/>
                <View>
                    <Popup type={this.state.captures.length==0?"front":
                                this.state.captures.length==1?"back":"none"}/>        
                    {this.state.cameraType==Camera.Constants.Type.back &&<ScanPreview/>}
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        autoFocus={autoFocus}
                        // focusDepth={0}
                        // useCamera2Api={true}
                        style={styles.preview}
                        ref={camera => this.camera = camera}
                    />
                </View>
                {captures.length > 0 && <Gallery captusres={captures} gotoImages={this.props.navigation.navigate} />}
                <Toolbar 
                    capturing={capturing}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={this.setFlashMode}
                    setCameraType={this.setCameraType}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    onLongCapture={this.handleLongCapture}
                    onShortCapture={this.handleShortCapture}
                    styleToolbar={this.state.toolbar}
                    onOk={this.handleOK}
                    onRemove={this.handleRemove}
                />
                </View>
            </React.Fragment>
        );
    };
};
class FElogo extends React.Component {
  render(){
    return(
      <Image style={styles.headerTt} source={require('../image/headerTab.jpeg')} />
    )
  }
}



const AppNavigator = createStackNavigator(
    {
      Camera:  {
        screen: CameraPage,
        navigationOptions: {
          header:null,
          headerVisible: false,
        }
      },
      images: imageScreen,
      work:{
        screen: workScreen,
        navigationOptions: {
          header:null,
          headerVisible: false,
        }}
      
    },
    
    
  );
  
  export default createAppContainer(AppNavigator);
