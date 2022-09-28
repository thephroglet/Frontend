import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import ChatBot from 'react-simple-chatbot';
import './chatbotbutton.css'

class ChatBotComponent extends Component {
    constructor(props) {
        super(props)
        this.steps = [
            
                {
                  id: '1',
                  message: 'What is your name?',
                  trigger: '2',
                },
                {
                  id: '2',
                  user: true,
                  trigger: '3',
                },
                {
                  id: '3',
                  message: 'Hi {previousValue}, nice to meet you!',
                  end: true,
                },
              
        ]
        this.state = {
            showChat: false,
        }
    }

    toggleChatBot() {
        this.setState({
            showChat: !this.state.showChat,
        })
    }

    render() {
        return (
            <>
                <div className="fixedButtonBot">
                    <ChatBot style={{ display: this.state.showChat ? 'block' : 'none' }} steps={this.steps} />
                    <Button size="sm" className="rounded-circle btn-icon" onClick={() => this.toggleChatBot()}>
                        <CsLineIcons icon="question-hexagon" />
                    </Button>
                </div>
            </>
        );
    }
}

export default ChatBotComponent;
