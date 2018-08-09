import {
    AppState
} from 'react-native';

import StaticServer from 'react-native-static-server';

import RNFetchBlob from "react-native-fetch-blob"

import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Epub ,Streamer} from 'epubjs-rn';
const Dirs = RNFetchBlob.fs.dirs

if (!global.Blob) {
    global.Blob = RNFetchBlob.polyfill.Blob;
}

const Uri = require("epubjs/lib/utils/url");


export default class TestView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //  url: 'https://s3.amazonaws.com/epubjs/books/moby-dick.epub'
           //url: "https://s3-us-west-2.amazonaws.com/pressbooks-samplefiles/MetamorphosisJacksonTheme/Metamorphosis-jackson.epub"
          //  url:'https://tdemconnect-dev.tdem.toyota-asia.com/api/v1/handbooks/download?file=00049'


        }

       // this.streamer = new MyStreamer();
        this.streamer = new Streamer();
    }

    async componentDidMount() {

        //console.log('componentDidMount')
        this.downloadEpubFile(this.state.url);
    
      }
    
      componentWillUnmount() {
        if (this.streamer)
          this.streamer.kill();
      }
    

    // startStreamer(epubPath) {
    //     this.streamer.start()
    //         .then((origin) => {
    //             this.setState({ origin })
    //             return this.streamer.get(epubPath);
    //         })
    //         .then((src) => {
    //             return this.setState({ src });
    //         });
    // }

    downloadEpubFile(bookUrl) {

        //console.log('[EPub] downloadEpubFilep path', bookUrl);
        //console.log('[EPub] downloadEpubFile TOKEN', this.state.FUNCTION_TOKEN);

        let dirs = RNFetchBlob.fs.dirs;
        let filename = this.filename(bookUrl);
        let targetFile = dirs.DocumentDir + '/epub/' + filename + '.epub';
    
        RNFetchBlob
          .config({
            fileCache: true,
            // response data will be saved to this path if it has access right.
            path: targetFile
          })
          //.fetch('GET', 'https://facebook.github.io/react-native/img/header_logo.png', {
          .fetch('GET', bookUrl, {
    
            Authorization: 'Bearer MjEuMS43Yzk2YzJmYjM3NzUzNGE5Zjk3NDYxNWU5N2NkY2IxYjEyNWUyMDhlM2U5NzM1N2YwMzNiNzEyYjE4Njk5NmY4NjcxNzFjYTg4NmJmNjM3MjE1Yjg0Yjk0ZDg0NDI5NWE4ZTVhZjExYWIxMGYwMTM2ZDZmZDE4YzY0NmZmMGU4NQ=='

          })
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            //console.log('The file saved to ', res.path())
            /*RNFetchBlob.fs.readFile(res.path(), 'utf8')
                    .then((data) => {
                      //console.log(data);
                    })*/
    
            let target = { url: Platform.OS === 'android' ? '' + res.path() : '' + res.path() }
            this.startStreamer(target.url);
            //this.startStreamer(this.state.url);
          });
    
      }
    
      startStreamer(epubPath) {
        //console.log('Start Streamer and locating path ', epubPath)
        this.streamer.start()
          .then((origin) => {
            this.setState({ origin })
            //return this.streamer.get(this.state.url);
            return this.streamer.get(epubPath);
          })
          .then((src) => {
            //console.log('Loading source ', src)
            return this.setState({ src });
          }).catch((err) => {
            // scan file error
            //console.log('[HandBookDetail] Catch Error', err);
           
            this.streamer.stop();
            if (this.reloadCount < 3) {
                //console.log('[HandBookDetail] url', SharedPreference.HOST+ this.state.handbook_file);
              this.downloadEpubFile(SharedPreference.HOST+ this.state.handbook_file)
              this.reloadCount++;
            } else {
              //console.log('[HandBookDetail] Reload count reach', err);
              //this.props.navigation.navigate("Handbooklist");
              Alert.alert("Handbook Error", "Cannot download handbook file.", [
                {
                  text: 'OK', onPress: () => {
                    this.props.navigation.navigate("HomeScreen");
                  }
                }
    
              ]);
            }
          });
      }
    

    
      filename(bookUrl) {
        let uri = new Uri(bookUrl);
        return uri.filename.replace(".epub", "");
      }

    render() {
        return (

          
                <Epub src={this.state.src}
              flow={"paginated"} />

         
            

        );

    }
}




