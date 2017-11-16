import React, { Component } from 'react';
import {Image,View } from 'react-native';
import { Container,Text, Content,Header,Title, Button, Icon,Thumbnail ,Left,Right,Body,List,ListItem} from 'native-base';
import {NimFriend} from 'react-native-netease-im';
import {NavigationActions} from 'react-navigation';

export  default class FriendDetail extends Component {
    static navigationOptions = {
        title: '详细信息',
    };
    toChat(){
        const {navigation} = this.props;
        const {friendData={},from} = navigation.state.params;
        let session = {
            ...friendData,
            sessionType:'0'
        };
        navigation.dispatch(NavigationActions.reset({
            index:1,
            actions:[
                NavigationActions.navigate({ routeName: 'ChatList'}),
                NavigationActions.navigate({ routeName: 'Chat',params:{session:session,title:session.alias || session.name}})
            ]
        }));
        // console.log(navigation.state.key)
        // navigation.goBack(from);
        // navigation.navigate("Chat",{session:session,title:session.alias || session.name})
        // navigator.push({
        //     screen:'ImDemo.Chat',
        //     title:session.alias || session.name,
        //     passProps:{session}
        // });
    }
    submitRequest(){
        const {navigation} = this.props;
        const {friendData={}} = navigation.state.params;

        NimFriend.ackAddFriendRequest(friendData.contactId,true).then(()=>{
            navigation.goBack()
        });
    }
    _renderRemark(){
        const {friendData = {}} = this.props.navigation.state.params;
        if(/^\d{5}$/.test(friendData.contactId)){
            return (
                <Content style={{paddingTop:12}}>
                    <View style={{backgroundColor:"#fff"}}>
                        <ListItem last>
                            <Thumbnail square style={{width:49,height:49,borderRadius:10}} source={friendData.avatar?{uri:friendData.avatar}:require('../images/head.png')} />
                            <Body>
                            <Text>{friendData.name}</Text>
                            </Body>
                        </ListItem>
                    </View>
                    <View style={{backgroundColor:"#fff",marginTop:12}}>
                        <ListItem last>
                            <Text>功能介绍</Text>

                            <Right>
                               <Text note>飞马钱包官方帐号</Text>
                            </Right>
                        </ListItem>
                    </View>

                </Content>
            )
        }
        return (
            <Content style={{paddingTop:12}}>
                <View style={{backgroundColor:"#fff"}}>
                    <ListItem last>
                        <Thumbnail square style={{width:49,height:49,borderRadius:10}} source={friendData.avatar?{uri:friendData.avatar}:require('../images/head.png')} />
                        <Body>
                            <Text>{friendData.alias || friendData.name}</Text>
                            {friendData.alias ? <Text note>昵称 : {friendData.name}</Text> : null}
                        </Body>
                    </ListItem>
                </View>
                <View style={{backgroundColor:"#fff",marginTop:12}}>
                    <ListItem last icon >
                        <Body>
                        <Text>设置备注</Text>
                        </Body>
                        <Right>
                            <Icon name="ios-arrow-forward"/>
                        </Right>
                    </ListItem>
                </View>
                <View style={{padding:12}}>
                    {this._renderButton()}
                </View>
            </Content>
        )
    }
    _renderButton(){
        const {friendData = {},isRequest} = this.props.navigation.state.params;
        if(isRequest){
            return (
                <Button block danger rounded onPress={()=>this.submitRequest()}>
                    <Text>通过验证</Text>
                </Button>
            )
        }
        if(friendData.isMyFriend === '0'){
            return (
                <Button block danger rounded onPress={()=>this.props.navigation.navigate("SendAddFriend",{
                    friendData:friendData
                })}>
                    <Text>添加到通讯录</Text>
                </Button>
            )
        }
        return (
            <Button block danger rounded onPress={()=>this.toChat()}>
                <Text>发消息</Text>
            </Button>
        )
    }
    render() {
        return (
            <Container style={{backgroundColor:"#f7f7f7"}}>
                {this._renderRemark()}
            </Container>
        );
    }
}
