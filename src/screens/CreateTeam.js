import React from 'react';
import {

    View,
    ListView,Image,
    ScrollView,
    Dimensions
} from 'react-native';
import {Container,Icon,ListItem,Text,Body,Right,Left,Header,Title,Button} from 'native-base';
import {NimTeam,NimFriend} from 'react-native-netease-im';

export  default class CreateTeam extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: '创建群聊'
    });
    // 构造
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) =>{
                return true;
            },
            sectionHeaderHasChanged:(s1,s2)=> s1 !== s2
        });
        this.state = {
            ds:ds.cloneWithRowsAndSections([]),
            selectAccounts:[]
        };

    }
    createTeam(){
        const {members,onSuccess} = this.props.navigation.state.params;
        let result = this.getIds();
        if(members && members.length > 0)
            result.push(members[0].contactId);
        if(result.length > 0){
            console.log(result)
            NimTeam.createTeam({
                name:'群聊',
                introduce:'群介绍',
                verifyType:'0',
                inviteMode:'1',
                beInviteMode:'1',
                teamUpdateMode:'1'
            },'0',result).then((res=>{
                console.log(res)
                onSuccess && onSuccess(res);
                this.props.navigation.goBack();

            }));

        }
    }
    getIds(){
        let arr = [];
        this.state.selectAccounts.map(res=>{
            arr.push(res.contactId);
        });
        return arr;
    }
    componentWillMount() {
        NimFriend.getFriendList('').then((data)=>{
            console.log(data)
            this.listData = this.formatData(data);
            this.setState({
                ds:this.state.ds.cloneWithRowsAndSections(this.listData),
            });
        });
    }
    formatData(data){
        let newObj = {};
        let h = transform(data).sort();
        h.map(res=>{
            newObj[res] = data[res];
        });
        return newObj;
    }
    getStatus(data){
        const {members=[]} = this.props;
        let isSelect = false;
        members.map((res)=>{
            if(data.contactId === res.contactId){
                isSelect = true;
            }
        });
        return isSelect;
    }
    _select(res,selectId,rowId){
        let newSelect = this.state.selectAccounts;
        if(res.isSelect){
            console.log(newSelect.indexOf(res))
            newSelect.splice(newSelect.indexOf(res),1)
        }else{
            newSelect.push(res);
        }
        this.listData[selectId].splice(rowId,1,{
            ...res,
            isSelect:res.isSelect ? false :true
        });
        this.setState({
            selectAccounts:newSelect,
            ds:this.state.ds.cloneWithRowsAndSections(this.listData),
        });
    }
    _renderSelect(){
        return this.state.selectAccounts.map(res=>{
            return (
                <Image key={res.contactId} style={{width:35,height:35,marginRight:5}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
            )
        });
    }
    _renderRow(res,sectionID,rowId){
        if(this.getStatus(res)){
            return(
                <ListItem key={res.contactId}>
                    <Icon name='ios-checkmark-circle' style={{color:'#ccc',marginRight:8}}/>
                    <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
                    <Body>
                    <Text>
                        {res.name}
                    </Text>
                    </Body>
                </ListItem>
            );
        }
        return(
            <ListItem key={res.contactId} onPress={()=>this._select(res,sectionID,rowId)}>
                <Icon name={res.isSelect ? 'ios-checkmark-circle' : 'ios-radio-button-off'}
                      style={{marginRight:8,color:res.isSelect ? '#d82617' : '#ccc'}}/>
                <Image style={{width:35,height:35}} source={res.avatar ? {uri:res.avatar} : require('../images/discuss_logo.png')} />
                <Body>
                <Text>
                    {res.name}
                </Text>
                </Body>
            </ListItem>
        );


    }
    _renderSectionHeader(sectionData,sectionID){
        return (
            <ListItem itemDivider><Text>{sectionID}</Text></ListItem>
        );
    }
    render() {
        const {navigation} = this.props;
        return (
            <Container style={{flex:1,backgroundColor:"#f7f7f7"}}>
                <Header>
                    <Left>
                        <Button transparent onPress={()=>navigation.goBack()}>
                            <Text>取消</Text>
                        </Button>
                    </Left>
                    <Body>
                    <Title>
                        创建群聊
                    </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>this.createTeam()}>
                            <Text>确定</Text>
                        </Button>
                    </Right>
                </Header>
                <View style={{width:width,height:51,backgroundColor:'#fff',justifyContent:'center',paddingHorizontal:8,borderBottomWidth:1,borderBottomColor:'#c9c9c9'}}>
                    <ScrollView horizontal style={{flex:1}} contentContainerStyle={{justifyContent:'center',alignItems:'center'}}>
                        {this._renderSelect()}
                    </ScrollView>
                </View>
                <ListView
                    style={{backgroundColor:"#fff"}}
                    dataSource= {this.state.ds}
                    renderRow= {this._renderRow.bind(this)}
                    enableEmptySections= {true}
                    removeClippedSubviews= {true}
                    renderSectionHeader={this._renderSectionHeader.bind(this)}
                />
            </Container>
        );
    }
}
const {width,height} = Dimensions.get('window');
function  transform(obj){
    var arr = [];
    for(var item in obj){
        arr.push(item);
    }
    arr.sort(mySorter);
    return arr;
}
function  mySorter(a, b){
    if (/^\d/.test(a) !== /^\D/.test(b)) return a > b ? 1 : (a = b ? 0 : -1);
    return a> b?-1:(a== b?0:1);
}