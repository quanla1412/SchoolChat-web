import 'remixicon/fonts/remixicon.css'
import './App.css';
import {Col, Container, Row} from 'react-bootstrap';
import WaitingRoom from './components/waitingroom';
import {useState} from 'react';
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username, chatroom) => {
    try {
      // Initiate a connection
      const conn = new HubConnectionBuilder()
          .withUrl("http://localhost:5274/chat")
          .configureLogging(LogLevel.Information)
          .build();
      // Set up handler
      conn.on("JoinSpecificChatRoom", (username, msg) => {
        setMessages(messages => [...messages, {username, msg}])
        console.log("msg: ", msg);
      });

      conn.on("ReceiveMessage", (username, msg) => {
        setMessages(messages => [...messages, {username, msg}])
        console.log("msg: ", msg);
      });


      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", {username, chatroom});

      setConnection(conn);
    } catch (e) {
      console.log(e)
    }
  }

  const sendMessage = async(message) => {
    try {
      await conn.invoke("SendMessage", message);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <main>
        <Container>
          <Row class='px-5 my-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'>Welcome to the ChatAllNight!</h1>
            </Col>
          </Row>
          { !conn
            ? <WaitingRoom joinChatRoom={joinChatRoom}/>
            : <ChatRoom messages={messages} sendMessage={sendMessage}></ChatRoom>
          }
        </Container>
      </main>
    </div>
  );
}

export default App;
