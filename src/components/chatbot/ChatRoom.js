import React, { useEffect, useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import authService from 'services/authService';
import { Card, Row, Col, Tab } from 'react-bootstrap';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import ContactListItem from '../../views/apps/chat/components/ContactListItem'
import HtmlHead from 'components/html-head/HtmlHead';
import ChatView from '../.../../../views/apps/chat/components/ChatView'
import UserService from 'services/UserService'

let stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState([]);     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab, setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: authService.getCurrentUser().firstname,
        receivername: '',
        connected: false,
        message: ''
      });
    useEffect(() => {
      console.log(userData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
          var chatMessage = {
            senderName: userData.username,
            senderThumb: "/img/profile/" + UserService.getProfileData().avatar,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload) => {
        console.log(payload)
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                console.log("USER JOINED", payloadData)
                if(!privateChats.some(user => user.name === payloadData.senderName)){
                    privateChats.push({
                        name: payloadData.senderName,
                        thumb: payloadData.senderThumb,
                    })
                    setPrivateChats(privateChats);
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=(message)=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                senderThumb: UserService.getProfileData().avatar,
                message: message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const sendMessage=(message)=>{
        console.log( "ESSAGE TO SEND", message)
        sendValue(message);
    }

    useEffect(connect, [0]);

    return (
        <>
        <HtmlHead title="Chat" />
        <div className="h-100 d-flex flex-column">
            <Row className="d-flex flex-grow-1 overflow-hidden pb-2 h-100">
                <Col xs="auto" className="w-100 w-md-auto h-100" id="listView">
                    <div className="sw-md-30 sw-lg-40 w-100 d-flex flex-column h-100">
                        <Card className="h-100">
                            <Tab.Container>
                            <Card.Body className="h-100-card">
                                <Tab.Content activeKey="members" className=" h-100">
                                    <Tab.Pane active="members" className="h-100 scroll-out">
                                    <OverlayScrollbarsComponent
                                        className="h-100 nav py-0"
                                        options={{ scrollbars: { autoHide: 'leave', autoHideDelay: 600 }, overflowBehavior: { x: 'hidden', y: 'scroll' } }}
                                    >
                                        {privateChats.map((item,index)=>(
                                            <ContactListItem item={item} key={index} />
                                        ))}
                                    </OverlayScrollbarsComponent>
                                    </Tab.Pane>
                                </Tab.Content>
                                </Card.Body>
                            </Tab.Container>
                        </Card>
                    </div>
                </Col>
                <div className="col h-100">
                    <ChatView sendMessage={sendMessage} chat={{
                        name: 'CHATROOM',
                        thumb: "/img/icons/chat.jpg",
                        messages: publicChats.filter(message => message.status === 'MESSAGE').map(message => {
                            const date = message.date || new Date()
                            return {
                                name: message.senderName,
                                thumb: "/img/profile/" + message.senderThumb,
                                text: message.message,
                                time: date.toLocaleDateString() + " | " + date.toLocaleTimeString(),
                                type: message.senderName !== userData.username ? 'response' : 'mine',
                                attachments: [],
                            }
                        })
                    }} />
                </div>
            </Row>
        </div>
        </>
    )
}

export default ChatRoom
