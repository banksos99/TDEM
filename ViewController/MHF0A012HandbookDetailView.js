/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { Epub, Streamer } from 'epubjs-rn';
import RNFetchBlob from "react-native-fetch-blob"
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'

const Uri = require("epubjs/lib/utils/url");




export default class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      //url: "https://s3-us-west-2.amazonaws.com/pressbooks-samplefiles/MetamorphosisJacksonTheme/Metamorphosis-jackson.epub",
      url: this.props.navigation.getParam("handbook_file", ""),
      //url: "https://tdemconnect-dev.tdem.toyota-asia.com/api/v1/handbooks/download?file=00022",
      src: '',
      TOKEN: this.props.navigation.getParam("FUNCTION_TOKEN", "")

    }

    this.streamer = new Streamer();
  }

  

  downloadEpubFile(bookUrl) {

    console.log('[EPub] downloadEpubFilep path',this.state.url);
    console.log('[EPub] downloadEpubFile TOKEN',this.state.TOKEN);
    let dirs = RNFetchBlob.fs.dirs;
    let filename = this.filename(bookUrl);
    let targetFile = dirs.DocumentDir + '/epub/' + filename + '.epub';

    RNFetchBlob
      .config({
        fileCache: false,
        // response data will be saved to this path if it has access right.
        path: targetFile
      })
      //.fetch('GET', 'https://facebook.github.io/react-native/img/header_logo.png', {
      .fetch('GET', bookUrl, {

        Authorization: this.state.TOKEN
      })
      .then((res) => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console.log('The file saved to ', res.path())
        /*RNFetchBlob.fs.readFile(res.path(), 'utf8')
                .then((data) => {
                  console.log(data);
                })*/

        let target = { url: Platform.OS === 'android' ? '' + res.path() : '' + res.path() }
        this.startStreamer(target.url);
        //this.startStreamer(this.state.url);
      });


  }
  

  startStreamer(epubPath) {
    console.log('Start Streamer and locating path ', epubPath)
    this.streamer.start()
      .then((origin) => {
        this.setState({ origin })
        //return this.streamer.get(this.state.url);
        return this.streamer.get(epubPath);
      })
      .then((src) => {
        console.log('Loading source ', src)
        return this.setState({ src });
      });
  }



  filename(bookUrl) {
    let uri = new Uri(bookUrl);
    return uri.filename.replace(".epub", "");
  }

  async componentDidMount() {

    console.log('componentDidMount')

   // FUNCTION_TOKEN =  await Authorization.convert(SharedPreference.profileObject.client_id,'1', SharedPreference.profileObject.client_token)

    this.downloadEpubFile(this.state.url);

  }

  componentWillUnmount() {
    if (this.streamer)
      this.streamer.kill();
  }

  render2() {
    return (

      <BookCover

        placeholderUrl={'https://facebook.github.io/react/logo-og.png'}
        coverUrl={'https://tdemconnect-dev.tdem.toyota-asia.com/api/v1/handbooks/download?file=00021'}
        bookName={new Date().getTime().toString()}

        style={{ width: "100%", height: "100%" }}
      />


    );
  }

  startStreamer4(epubPath) {

    this.streamer.start()
      .then((origin) => {
        console.log('Start Streamer and locating path ', epubPath)

        //this.streamer.add(epubPath);
        //this.setState({ epubPath });
        let src = this.manualAdd(this.streamer, epubPath);
        console.log("[App.js] Try to set State src: " + src);
        this.setState({ src });
      });

    //this.streamer.start();
    //this.setState({ src });
  }
  startStreamer3(epubPath) {

    this.streamer.start()
      .then((origin) => {
        this.setState({ origin })
        //return this.streamer.get(this.state.url);
        return this.streamer.get(epubPath);
      })
      .then((src) => {
        console.log('Loading source ', src)
        return this.setState({ src });
      });
    console.log('Start Streamer and locating path ', epubPath)

    //this.streamer.add(epubPath);
    //this.setState({ epubPath });
    let src = this.manualAdd(this.streamer, epubPath);
    console.log("[App.js] Try to set State src: " + src);
    this.streamer.start();
    //this.setState({ src });
  }

  manualAdd(st, bookUrl) {

    let uri = new Uri(bookUrl);
    const filename = st.filename(bookUrl);

    console.log("[App.js] Try to RNFetchBlob: " + RNFetchBlob.fs.dirs.DocumentDir + '/' + filename);

    const sourcePath = bookUrl;
    const targetPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${st.root}/${filename}`;
    const url = `${st.serverOrigin}/${filename}/`;
    console.log("[App.js] Try to Unzip: " + sourcePath);
    return unzip(sourcePath, targetPath)
      .then((path) => {
        console.log("[App.js] Unzipped: " + path);
        st.urls.push(bookUrl);
        st.locals.push(url);
        st.paths.push(path);

        // res.flush();

        return url;
      });
    /*
    RNFetchBlob
      .config({
        fileCache : true,
        path: RNFetchBlob.fs.dirs.DocumentDir + '/' + filename
      })
      .fetch("GET", bookUrl)
      .then((res) => {
        console.log("[App.js] RNFetchBlob Fetched: " + RNFetchBlob.fs.dirs.DocumentDir + '/' + filename);
        const sourcePath = res.path();
        const targetPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${st.root}/${filename}`;
        const url = `${st.serverOrigin}/${filename}/`;

        return unzip(sourcePath, targetPath)
          .then((path) => {

            st.urls.push(bookUrl);
            st.locals.push(url);
            st.paths.push(path);

            // res.flush();

            return url;
          })
      });*/
  }

  render() {
    return (

      <Epub src={this.state.src}
        flow={"paginated"} />


    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
