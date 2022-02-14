import './App.css';
import React from 'react';
import styled from 'styled-components';
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import Chat from './components/Chat.js';
import Login from './components/Login.js';
import { BrowserRouter,  Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from './firebase';
import Spinner from 'react-spinkit'
import {appendMessage, updateUserMongo } from "./features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectRoomId, selectUserMongo } from './features/appSlice'

function App() {
  const [user, loading] = useAuthState(auth);
  // const [userMongo, updateUserMongo] = React.useState();
  const roomId = useSelector(selectRoomId);
  const userMongo = useSelector(selectUserMongo);
  const dispatch = useDispatch();

  React.useEffect(function effectFunction() {
    async function fetchRootDomain(){
        // this function actually no use, just for testing
        var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}`)
        console.log("process.env.REACT_APP_EXTERNAL_HOST : ", process.env.REACT_APP_EXTERNAL_HOST)
        const response = await fetch(url);
        const json = await response.json();
        console.log("response messages : ", json["data"])

    }
    user && fetchRootDomain();
  }, [user]); 
  // second parameter is dependency: effect will be activated if the value in the list change

  React.useEffect(function effectFunction() {
      async function fetchUser(){
          // var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/userByEmail`)
          var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/userAuth`)
          // var params = {
          //   email: user.email,
          //   user_image: user.photoURL,
          // }
          // console.log("App.js - email", user.email, " user_image: ", user.photoURL)
          // url.search = new URLSearchParams(params).toString();

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              user_image: user.photoURL,
            })
          };
          console.log("userAuth requestionOptions body:", requestOptions.body)
          const response = await fetch(url, requestOptions);
          const json = await response.json();
          console.log("response messages : ", json["data"])
          // updateUserMongo(json["data"]);
          dispatch(updateUserMongo({
            userMongo: json["data"],
          })) 

      }
      user && fetchUser();
  }, [user, dispatch]); 
  // second parameter is dependency: effect will be activated if the value in the list change

  var conn
  function dial() {
    // conn = new WebSocket("ws://localhost:8080/websocket")
    conn = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_EXTERNAL_HOST}`)
    console.log("process.env.REACT_APP_WEBSOCKET_EXTERNAL_HOST", process.env.REACT_APP_WEBSOCKET_EXTERNAL_HOST)
    conn.addEventListener("close", ev => {
      console.log(`WebSocket Disconnected code: ${ev.code}, reason: ${ev.reason}`, true)
      if (ev.code !== 1001) {
        console.log("Reconnecting in 10s", true)
        setTimeout(dial, 10000)
      }
    })
    conn.addEventListener("open", ev => {
      console.info("websocket connected");
      console.log("inside sendUserInfo...")
      try {
          user && userMongo && conn.send(JSON.stringify({
            "message": "[USERINFO]",
            "room_id": "",
            "user_id": userMongo.id,
            "username":user.displayName,
            "user_image": user.photoURL,
            "timestamp": new Date().toISOString(),
        }));

      } catch (e) {
          console.error("Error adding document: .", e);
      }
    })

    // This is where we handle messages received.
    conn.addEventListener("message", ev => {
      if (typeof ev.data !== "string") {
        console.log("============================================")
        console.error("unexpected message type", typeof ev.data)
        console.log("============================================")
        return
      }
      dispatch(appendMessage({
        roomId: roomId,
        newMsg: JSON.parse(ev.data),
      }))

      console.log("Incoming Data:", JSON.parse(ev.data))

    })
  }
  dial()

  if (loading){
    return (
      <AppLoading>
        <AppLoadingContents>
          <img
              src="https://cdn.cdnlogo.com/logos/s/40/slack-new.svg"
              alt=""
          />
          <Spinner 
            name="ball-spin-fade-loader"
            color="purple"
            fadeIn="none"
          />
        </AppLoadingContents>
      </AppLoading>
    )
  }
  return (
    <div className="App">
    <BrowserRouter>
      {!user ?(
            <Login />
          ):(
      <>
        <Header />
        <AppBody>
          <Sidebar websocket={conn} userMongo={userMongo} />
          <Routes>
              <Route path="/" element={<Chat websocket={conn} />} />
          </Routes>
        </AppBody>
      </>
      )}
    </BrowserRouter>
    </div>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;

const AppLoading = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100%;
`;

const AppLoadingContents = styled.div`
  text-align: center;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > img{
    height: 200px;
    padding: 20px;    
  }
`;
