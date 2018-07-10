/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Picker

} from 'react-native';
import { Epub, Streamer } from 'epubjs-rn';

import BottomBar from '../component/BottomBar'
import TopBar from '../component/TopBar'
import Nav from '../component/Nav'
import { styles } from "./../SharedObject/MainStyles"
import Colors from '../SharedObject/Colors';

let fontsizearr = ['50%', '80%', '100%', '120%', '150%', '180%'];
let fontname = ['times', 'courier', 'arial', 'serif', 'cursive','fantasy','monospace'];

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class HandbookViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flow: "paginated", // paginated || scrolled-continuous
      location: 1,
      url: "https://s3.amazonaws.com/epubjs/books/moby-dick.epub",
      src: "",
      origin: "",
      title: "",
      toc: [],
      showBars: false,
      showNav: true,
      sliderDisabled: true,
      expand: false,
      fontsizelivel: 2,
      currentpage: 0,
      totalpage: 0,
      filterImageButton: require('./../resource/images/ExpandEpub.png'),
      lowerImage: require('../resource/redufont_ena.png'),
      upperImage: require('../resource/expanfont_ena.png'),
      expandheight: 0,
      chapter: 0,
      position: 'epubcfi(/6/12[xepigraph_001]!/4/2/4)',
      modalVisible: true,
      isscreenloading: true,
      loadingtype: 1,
      tocviewheight: '100%',
      hilightviewheight:'0%',
      selectfontnametext: fontname[0],
      hilightList: [],
      typeTOC: 1,
      showTOC:1,
      titleTOC: 'Table Of Content',
   
    };

    this.streamer = new Streamer();
  }

  componentDidMount() {

    console.log('dsdsdadadad')
    this.streamer.start()
      .then((origin) => {
        this.setState({ origin })
        return this.streamer.get(this.state.url);
      })
      .then((src) => {
        return this.setState({ src });
      });
  }

  componentWillUnmount() {
    this.streamer.kill();
  }

  toggleBars() {
    this.setState({ showBars: !this.state.showBars });
  }

  expand_collapse_Function = () => {

    if (this.state.expandheight) {
      this.setState({

        expandheight: 0,

        filterImageButton: require('./../resource/images/ExpandEpub.png')

      });
    }
    else {
      this.setState({

        expandheight: 53,

        filterImageButton: require('./../resource/images/close.png')

      });

    }
    this.epub.fontSize = '150%'
    // this.setState({});
  }

  upper_font_size = () => {

    this.setState({

      fontsizelivel: this.state.fontsizelivel + 1

    });
  }

  lower_font_size = () => {

    this.setState({

      fontsizelivel: this.state.fontsizelivel - 1

    });

  }

  onBack() {

    if (this.state.typeTOC) {

      this.props.navigation.navigate('Handbooklist');

    } else {
      this.setState({
        typeTOC: 1,
        titleTOC: 'Table Of Content'
      })
    }

  }

  onOpenTOC() {
    this.setState({
      showTOC: 1,
    })
  }

  _onPress(item) {
    console.log('item :', item)
    this.setState({
      showTOC: 0,
      location: item.href,
      // position: 'epubcfi(/6/12[xepigraph_001]!/4/2/4)'
    })
  }

  _onhilight(item) {

    console.log('item :', item)
    this.setState({
      showTOC: 0,
      location: item,
      // position: 'epubcfi(/6/12[xepigraph_001]!/4/2/4)'

    })

  }
  onchangefont() {

    this.setState({

      loadingtype: 0,
      isscreenloading: true,

    }, function () {



    });


  }
  selected_Font(fontselected) {

    this.setState({

      loadingtype: 1,
      isscreenloading: false,

    }, function () {



    });

  }
  onSelecteFont = () => {

    this.setState({

      loadingtype: 1,
      isscreenloading: false,

    }, function () {

    });

  }
  onSelecteTable = () => {

    this.setState({

      typeTOC: 1,
      titleTOC: 'Table Of Content'

    }, function () {

    });

  }
  onSelecteHilight = () => {

    if (this.state.typeTOC) {

      this.setState({

        typeTOC: 0,
        titleTOC: 'Highlight'

      }, function () {

      });
    }
  }

  renderupperbutton() {

    if (this.state.fontsizelivel < 4) {
      return (
        <TouchableOpacity style={{ flex: 2, justifyContent: 'center' }} onPress={this.upper_font_size}>
          <Image style={{ width: 50, height: 50, }} source={require('../resource/expanfont_ena.png')} />
        </TouchableOpacity>
      );
    }
    return (
      <Image style={{ width: 50, height: 50, }} source={require('../resource/expanfont_dis.png')} />
    );
  }

  renderlowerbutton() {

    if (this.state.fontsizelivel > 0) {
      return (
        <TouchableOpacity style={{ flex: 2, justifyContent: 'center' }} onPress={this.lower_font_size}>
          <Image style={{ width: 50, height: 50, }} source={require('../resource/redufont_ena.png')} />
        </TouchableOpacity>
      );
    }
    return (
      <Image style={{ width: 50, height: 50, }} source={require('../resource/redufont_dis.png')} />
    );

  }
  renderexpand() {

    if (this.state.expandheight) {

      return (
        <View style={{ height: 50, backgroundColor: 'white', flexDirection: 'row' }} >
          <View style={{ flex: 3, justifyContent: 'center' }} >
            <Text style={{ textAlign: 'center' }}>Text Size</Text>
          </View>
          {this.renderlowerbutton()}
          {this.renderupperbutton()}
          <View style={{ flex: 3, justifyContent: 'center' }} >
            <Text style={{ textAlign: 'center' }}>Font Style</Text>
          </View>
          <View style={{ flex: 4, justifyContent: 'center', borderWidth: 1, borderRadius: 5, margin: 8, backgroundColor: 'lightgray' }} >
            <TouchableOpacity style={{ flex: 2, justifyContent: 'center' }} onPress={this.onchangefont.bind(this)}>
              <Text style={{ textAlign: 'left', color: 'red', marginLeft: 5 }}>{this.state.selectfontnametext}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    }
  }

  renderpickerview() {

    if (this.state.loadingtype == 0) {

      if (Platform.OS === 'android') {
        //console.log('android selectmonth')
        return (
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
            <View style={{ width: '80%', backgroundColor: 'white' }}>
              <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
                <Text style={{ marginLeft: 20, marginTop: 10, textAlign: 'left', color: 'black', fontSize: 18, fontWeight: 'bold' }}>Select Font</Text>
              </View>
              <ScrollView style={{ height: '40%' }}>
                {
                  fontname.map((item, index) => (
                    <TouchableOpacity style={styles.button}
                      onPress={() => { this.selected_Font(index) }}
                      key={index + 100}>
                      <View style={{ justifyContent: 'center', height: 40, alignItems: 'center', }} key={index + 200}>
                        <Text style={{ textAlign: 'center', fontSize: 18, width: '100%', height: 30, alignItems: 'center' }}> {item}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
        )

      }
      return (
        <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
          <View style={{ width: '80%', backgroundColor: 'white' }}>
            <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
              <Text style={{ marginLeft: 20, marginTop: 10, textAlign: 'left', color: 'black', fontSize: 18, fontWeight: 'bold' }}>Select Font</Text>
            </View>
            <Picker
              selectedValue={this.state.selectfontname}
              onValueChange={(itemValue, itemIndex) => this.setState({
                selectfontname: itemValue,
                selectfontnametext: fontname[itemIndex],

              }, function () {

                // selectfont = itemValue;

              })}>{
                fontname.map((item, index) => (

                  <Picker.Item label={item} value={item} key={index} />

                ))}
            </Picker>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 50, alignItems: 'center', }}>

              <TouchableOpacity style={styles.button}
                onPress={(this.onSelecteFont.bind(this))}
              >
                <Text style={{ textAlign: 'center', color: Colors.redTextColor, fontSize: 18, width: 80, height: 30, alignItems: 'center' }}> OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )

    }
    return (
      <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
        <ActivityIndicator />
      </View>
    )

  }

  renderloadingscreen() {

    if (this.state.isscreenloading) {

      return (
        <View style={{ height: '100%', width: '100%', position: 'absolute', }}>
          <View style={{ backgroundColor: 'black', height: '100%', width: '100%', position: 'absolute', opacity: 0.7 }}>

          </View>
          {this.renderpickerview()}
        </View>
      )
    }

  }

  renderTableOfContent() {

    if (this.state.showTOC) {

      return (

        <View style={{ height: '100%', width: '100%', position: 'absolute', backgroundColor: 'white' }}>
          <View style={[styles.navContainer, { flexDirection: 'column' }]}>
            <View style={styles.statusbarcontainer} />
            <View style={{ height: 50, flexDirection: 'row', }}>
              <View style={{ flex: 1, justifyContent: 'center', }}>
                <TouchableOpacity onPress={(this.onBack.bind(this))}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require('./../resource/images/Back.png')}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.navTitleTextTop]}>{this.state.titleTOC}</Text>
              </View>
              <View style={{ flex: 1, }}>
              <TouchableOpacity  style={{flex:1,  justifyContent: 'center',alignItems:'center' }}
               onPress={(this.onSelecteHilight.bind(this))}>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={this.state.typeTOC? require('./../resource/images/highlight.png'):require('./../resource/images/empty.png')}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <View style={{ height: 40, backgroundColor: 'blue', flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1 }}
              onPress={(this.onSelecteTable.bind(this))}
            >
              <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>

                <Text style={{color:'white'}}>Table Of Content</Text>

              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}
              onPress={(this.onSelecteHilight.bind(this))}
            >
              <View style={{ flex: 1, backgroundColor: 'green' , justifyContent: 'center', alignItems: 'center'}}>

                <Text style={{color:'white'}}>Hightlight</Text>

              </View>
            </TouchableOpacity>
          </View> */}
          {this.renderTableContent()}
        </View>
      )
    }

  }

  renderTableContent() {

    if (this.state.typeTOC) {
      console.log('this.state.toc :', this.state.toc)
      return (
        <ScrollView style={{ height: '40%' }}>
          {
            this.state.toc.map((item, index) => (
              <TouchableOpacity style={styles.button}
                onPress={() => this._onPress(item)}
                key={index + 100}>
                <View style={{ justifyContent: 'center', height: 40, marginLeft: 20, marginRight: 20 }}>
                  <Text style={styles.epubTocText} numberOfLines={1}> {item.label}</Text>
                </View>
                <View style={{ height: 1, backgroundColor: Colors.calendarLocationBoxColor }}>

                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      );

    }
    console.log('this.state.hilightList :', this.state.hilightList)

    return (

      <ScrollView style={{ height: '40%' }}>
        {
          this.state.hilightList.map((item, index) => (
            <TouchableOpacity style={styles.button}
              onPress={() => this._onhilight(item)}
              key={index + 100}>
              <View style={{ justifyContent: 'center', height: 40, marginLeft: 20, marginRight: 20 }}>
                <Text style={styles.epubTocText} numberOfLines={1}> {item}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: Colors.calendarLocationBoxColor }}>

              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    );

  
  }
  render() {

    // if (this.state.flow === "paginated") {
    //   this.setState({flow: "scrolled-continuous"});
    // } else {
    //   this.setState({flow: "paginated"});
    // }
    return (
      <View style={{ flex: 1 }}>

        <View style={[styles.navContainer, { flexDirection: 'column' }]}>
          <View style={styles.statusbarcontainer} />
          <View style={{ height: 50, flexDirection: 'row', }}>
            <View style={{ flex: 1, justifyContent: 'center', }}>
              <TouchableOpacity onPress={(this.onOpenTOC.bind(this))}>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('./../resource/images/Back.png')}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[styles.navTitleTextTop, { fontFamily: "Prompt-Bold" }]}>E-Book</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={this.expand_collapse_Function}
                >
                <Image
                  style={{ width: 50, height: 50 }}
                  source={this.state.filterImageButton}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {this.renderexpand()}

        <Epub style={styles.epubreader}
          ref={component => this.epub = component}
          //src={"https://s3.amazonaws.com/epubjs/books/moby-dick.epub"}
          src={this.state.src}
          // fontFamily={['Prompt-Medium', 'Prompt-Medium', 'Prompt-Medium']}
          font={this.state.selectfontnametext}
          height='100%'
          fontSize={fontsizearr[this.state.fontsizelivel]}
          flow={this.state.flow}
          location={this.state.location}

          onLocationChange={(visibleLocation) => {
            console.log("locationChanged : ", visibleLocation.start.displayed)
            this.setState({
              currentpage: visibleLocation.start.displayed.page,
              totalpage: visibleLocation.start.displayed.total
            });
          }}
          onLocationsReady={(locations) => {
            console.log("location total", locations.total);
            this.setState({ sliderDisabled: false });
          }}
          onReady={(book) => {
            // console.log("Metadata", book.package.metadata)
            console.log("Table of Contents", book.toc)
            this.setState({
              book: book,
              title: book.package.metadata.title,
              toc: book.navigation.toc,
              isscreenloading: false
            });
          }}
          onPress={(cfi, position, rendition) => {
            this.toggleBars();
            console.log("press", cfi);

          }}
          onLongPress={(cfi, rendition, cfiRange) => {
            console.log("longpress", cfiRange);


          }}
          onViewAdded={(index) => {
            console.log("added", index)
          }}
          beforeViewRemoved={(index) => {
            console.log("removed", index)
          }}
          onSelected={(cfiRange, rendition,selected) => {
            console.log("selected", cfiRange.toString())
            console.log("highlight :", rendition.highlight)
            console.log("book :",  this.state.book.render)

            // this.state.book.getRange(cfiRange).then((range) => {
            //   if (range) {
            //       let text = range.toString();
            //       let startOffset = range.startOffset;
            //       let paragraph = range.startContainer.data;
            //       let length = range.startContainer.length;
            //       console.log("text :", text)
            //   }
            // });

            // Add marker
            rendition.highlight(cfiRange, {
            
            });
            // rendition.href
            this.state.hilightList.push(cfiRange)

          }}
          
          onMarkClicked={(cfiRange) => {
            console.log("mark clicked", cfiRange)
          }}

          themes={{
            tan: {
              body: {
              //  "-webkit-user-select": "none",
                //"user-select": "none",
                //"background-color": "tan",
                'color':'black',
              //  'background-color':'black',
              'fill': 'red',
                'font-family':'cursive',
                'highlight':'green'
               // 'font-size':'50%'
              }
            }
          }}
          theme="tan"
        highlights={{


        }}
          regenerateLocations={true}
          generateLocations={true}
          origin={this.state.origin}
          onError={(message) => {
            console.log("EPUBJS-Webview", message);
          }}
        />

        {/* <View
          style={[styles.bar, { top: 50 }]}>
          <TopBar
            title={this.state.title}
            shown={true}
            onLeftButtonPressed={() => this._nav.show()}
            onRightButtonPressed={
              (value) => {
                if (this.state.flow === "paginated") {
                  this.setState({ flow: "scrolled-continuous" });
                } else {
                  this.setState({ flow: "paginated" });
                }
              }
            }
          />
        </View>
        <View
          style={[styles.bar, { bottom: 20 }]}>
          <BottomBar
            disabled={this.state.sliderDisabled}
            value={this.state.visibleLocation ? this.state.visibleLocation.start.percentage : 0}
            shown={this.state.showBars}
            onSlidingComplete={
              (value) => {
                this.setState({ location: 'epubcfi(/6/24[xchapter_006]!/4/2/10)' })
                console.log('value.toFixed(1):', value.toFixed(1))
                // this.epub.highlight({ x: 264, y: 209}, {});
              }
            } />
        </View>
        <View>
          <Nav ref={(nav) => this._nav = nav}
            display={(loc) => {
              this.setState({ location: loc });
            }}
            toc={this.state.toc}
          />
        </View > */}
        <View style={{ height: 30, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', }}>{this.state.currentpage + ' / ' + this.state.totalpage}</Text>
        </View>
        {this.renderTableOfContent()}
        {this.renderloadingscreen()}
        
      </View>
    );
  }
}

