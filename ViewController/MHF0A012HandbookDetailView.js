/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import RNFetchBlob from 'react-native-fetch-blob'

import {
    Platform,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Picker,
    Alert,
    BackHandler
} from 'react-native';

import { Epub, Streamer } from 'epubjs-rn';

import BottomBar from '../component/BottomBar'
import TopBar from '../component/TopBar'
import Nav from '../component/Nav'
import { styles } from "./../SharedObject/MainStyles"
import Colors from '../SharedObject/Colors';
import SharedPreference from '../SharedObject/SharedPreference';

let fontsizearr = ['50%', '80%', '100%', '120%', '150%', '180%'];
let fontname = ['times', 'courier', 'arial', 'serif', 'cursive', 'fantasy', 'monospace'];
let HandbookHighlightList = [];
let HandbookMarkList = [];

const Uri = require("epubjs/lib/utils/url");

export default class HandbookViewer extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            flow: "paginated", // paginated || scrolled-continuous
            location: 0,
            src: '',
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
            hilightviewheight: '0%',
            selectfontnametext: fontname[0],
            typeTOC: 1,
            showTOC: 1,
            titleTOC: 'Table Of Content',

           handbook_file: this.props.navigation.getParam("handbook_file", ""),
           FUNCTION_TOKEN: this.props.navigation.getParam("FUNCTION_TOKEN", ""),
      
        };

        this.streamer = new Streamer();
        this.reloadCount = 0;


    }

    componentDidMount() {

        this.downloadEpubFile(SharedPreference.HOST + this.state.handbook_file);
        HandbookHighlightList = [];
        HandbookMarkList = [];
        for (let i = 0; i < SharedPreference.Handbook.length; i++) {
            if (SharedPreference.Handbook[i].handbook_name === this.state.handbook_file) {
                HandbookHighlightList = SharedPreference.Handbook[i].handbook_hilight
                HandbookMarkList = SharedPreference.Handbook[i].handbook_mark
            }
        }
    }

    componentWillMount() {

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    handleBackButtonClick() {

        this.onBack()
        return true;
    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

        // SharedPreference.Handbook.push({
        //     handbook_name: this.state.handbook_file,
        //     handbook_file: HandbookHighlightList
        // })

        let tempHB = [];

        for (let i = 0; i < SharedPreference.Handbook.length; i++) {

            if (SharedPreference.Handbook[i].handbook_name === this.state.handbook_file) {

            } else {
                tempHB.push(
                    SharedPreference.Handbook[i]
                )

            }
        }
        //push new data
        tempHB.push({
            handbook_name: this.state.handbook_file,
            handbook_hilight: HandbookHighlightList,
            handbook_mark: HandbookMarkList

        })

        SharedPreference.Handbook = tempHB

        if (this.streamer)
            this.streamer.kill();
    }

    downloadEpubFile(bookUrl) {

        let dirs = RNFetchBlob.fs.dirs;
        let filename = this.filename(bookUrl);
        let targetFile = dirs.DocumentDir + '/epub/' + filename + '.epub';

        RNFetchBlob
            .config({
                fileCache: true,
                // response data will be saved to this path if it has access right.
                path: targetFile
            })
     
            .fetch('GET', bookUrl, {

                Authorization: this.state.FUNCTION_TOKEN

            })
            .then((res) => {
               
                let target = { url: Platform.OS === 'android' ? '' + res.path() : '' + res.path() }
                this.startStreamer(target.url);
            
            });

    }

    startStreamer(epubPath) {
       
        this.streamer.start()
            .then((origin) => {
                this.setState({ origin })
              
                return this.streamer.get(epubPath);
            })
            .then((src) => {
              
                return this.setState({ src });
            }).catch((err) => {
            
                this.streamer.stop();
                if (this.reloadCount < 3) {
                   
                    this.downloadEpubFile(SharedPreference.HOST + this.state.handbook_file)
                    this.reloadCount++;
                } else {
                  
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
    //    this.epub.fontSize = '150%'
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
        //console.log('item :', item)
        this.setState({
            showTOC: 0,
            location: item.href,
            // position: 'epubcfi(/6/12[xepigraph_001]!/4/2/4)'
        })
    }

    _onhilight(item) {
        //console.log('item :', item)
        this.setState({
            showTOC: 0,
            location: item.link,
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
            selectfontnametext: fontselected
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
                ////console.log('android selectmonth')
                return (
                    <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', }} >
                        <View style={{ width: '80%', backgroundColor: 'white' }}>
                            <View style={{ height: 50, width: '100%', justifyContent: 'center', }}>
                                <Text style={styles.alertDialogBoxText}>Select Font</Text>
                            </View>
                            <ScrollView style={{ height: '40%' }}>
                                {
                                    fontname.map((item, index) => (
                                        <TouchableOpacity style={styles.button}
                                            onPress={() => { this.selected_Font(item) }}
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
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={(this.onSelecteHilight.bind(this))}>
                                    <Image
                                        style={{ width: 30, height: 30 }}
                                        source={this.state.typeTOC ? require('./../resource/images/highlight.png') : require('./../resource/images/empty.png')}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                   
                    {this.renderTableContent()}
                </View>
            )
        }

    }

    renderTableContent() {

        if (this.state.typeTOC) {
            //console.log('this.state.toc :', this.state.toc)
            return (
                <ScrollView style={{ height: '40%' }}>
                    {
                        this.state.toc.map((item, index) => (
                            <TouchableOpacity style={styles.button}
                                onPress={() => this._onPress(item)}
                                key={index + 100}>
                                <View style={{ justifyContent: 'center', height: 40, marginLeft: 20, marginRight: 20 }}>
                                    {/* <View style={{ flex: 1, ustifyContent: 'center', flexDirection: 'column' }}> */}
                                    <Text style={styles.epubTocText} numberOfLines={1}> {item.label}</Text>
                                    {/* <Text style={styles.epubHighlighttitleText} numberOfLines={1}> {item.title}</Text> */}
                                    {/* </View> */}
                                </View>
                                <View style={{ height: 1, backgroundColor: Colors.calendarLocationBoxColor }}>
                                </View>
                            </TouchableOpacity>
                        ))}
                </ScrollView>
            );

        }
        //console.log('this.state.hilightList :', this.state.HandbookMarkList)
       // if(item.date){}
        // let item = item.date.split(' ')
        // let time = item[2] + item[1] + item[3]
        return (

            <ScrollView style={{ height: '40%' }}>
                {
                    HandbookMarkList.map((item, index) => (
                        <TouchableOpacity style={styles.button}
                            onPress={() => this._onhilight(item)}
                            key={index + 100}>
                            <View style={{ justifyContent: 'center', height: 40, marginLeft: 20, marginRight: 20 }}>
                                <View style={{ flex: 1, ustifyContent: 'center', flexDirection: 'column' }}>
                                    <Text style={styles.epubHighlightdateText} numberOfLines={1}> {item.date}</Text>
                                    <Text style={styles.epubHighlighttitleText} numberOfLines={1}> {item.title}</Text>
                                </View>
                            </View>
                            <View style={{ height: 1, backgroundColor: Colors.calendarLocationBoxColor }}>

                            </View>
                        </TouchableOpacity>
                    ))}
            </ScrollView>
        );


    }
    render() {

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
                            <Text style={[styles.navTitleTextTop, { fontFamily: "Prompt-Regular" }]}>{this.state.title}</Text>
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
                  //  ref={component => this.epub = component}
                    src={this.state.src}

                    flow={"paginated"}
                    font={this.state.selectfontnametext}
                    height='100%'
                    fontSize={fontsizearr[this.state.fontsizelivel]}
                    flow={this.state.flow}
                    location={this.state.location}
                    onLocationChange={(visibleLocation) => {
                        //console.log("locationChanged : ", visibleLocation.start.displayed)
                        this.setState({
                            currentpage: visibleLocation.start.displayed.page,
                            totalpage: visibleLocation.start.displayed.total
                        });
                    }}

                    onLocationsReady={(locations) => {

                        this.setState({ sliderDisabled: false });

                    }}

                    onReady={(book) => {

                        // add old highlight
                        for (let i = 0; i < HandbookHighlightList.length; i++) {

                            this.epub.rendition.highlight(HandbookHighlightList[i], {});

                        }

                        this.setState({
                            book: book,
                            title: book.package.metadata.title,
                            toc: book.navigation.toc,
                            isscreenloading: false
                        });


                    }}

                    onPress={(cfi, position, rendition) => {
                        this.toggleBars();
                        //console.log("press", cfi);
                    }}

                    onLongPress={(cfi, rendition, cfiRange) => {
                        //console.log("longpress", cfiRange);
                    }}

                    onViewAdded={(index) => {
                        //console.log("added", index)
                    }}

                    beforeViewRemoved={(index) => {
                        //console.log("removed", index)
                    }}

                    onSelected={(cfiRange, rendition, selected) => {

                        let datatext = ''
                        HandbookHighlightList.push(
                            cfiRange
                        )
                        // Add marker
                        rendition.highlight(cfiRange, {});


                    }}
                    
                    onMarkClicked={(cfiRange) => {
                       

                        Alert.alert(
                            'SAVE',
                            'Do you want a save Marker',
                            [
                                {
                                    text: 'OK', onPress: () => {

                                        let datatext = ''
                                        this.state.book.getRange(cfiRange).then((range) => {

                                            if (range) {
                                                datatext = range.startContainer.data.slice(range.startOffset, range.endOffset)
                                                let newdate = new Date().toString()
                                                let timearr = newdate.split(' ')

                                                HandbookMarkList.push({
                                                    link: cfiRange,
                                                    title: datatext,
                                                    date: timearr[2] + ' ' + timearr[1] + ' ' + timearr[3] + ' at ' + timearr[4]
                                                })

                                            }

                                        })
                                    }
                                },{ text: 'Cancle', onPress: () => { } }

                            ],
                            { cancelable: false }
                        )

                    }}

                />


                <View style={{ height: 30, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', }}>{this.state.currentpage + ' / ' + this.state.totalpage}</Text>
                </View>
                {this.renderTableOfContent()}
                {this.renderloadingscreen()}

            </View>
        );
    }
}

