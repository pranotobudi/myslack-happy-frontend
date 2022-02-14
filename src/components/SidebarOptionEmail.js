import React from 'react';
import styled from 'styled-components';
import {enterRoom} from "../features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectUserMongo } from '../features/appSlice'

export default function SidebarOptionEmail({id, roomName, Icon, title, addChannelOption}) {
    console.log("SidebarOption comp")

    const dispatch = useDispatch();
    const userMongo = useSelector(selectUserMongo);

    const mailChat = async () => {
        console.log("inside mailChat: ", userMongo.rooms)
        
        var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/mailChat`)
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id:userMongo.id,
            email: userMongo.email,
            username:userMongo.username,
            user_image:userMongo.user_image,
            rooms:userMongo.rooms,        
        })
        };
        alert("The request to mail the chat has been sent");
        console.log("mailChat request body", requestOptions.body)
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        console.log("mailChat response messages : ", json["data"])
        alert(json["data"]);
    }


    return (
        <SidebarOptionEmailContainer
            onClick = { mailChat }
        >
            {Icon && <Icon fontSize="small" style={{ padding: 10 }} />}
            <h3>{title}</h3>
        </SidebarOptionEmailContainer>

    )
}

const SidebarOptionEmailContainer = styled.div`
    display: flex;
    font-size: 12px;
    align-items: center;
    padding-left: 2px;
    cursor: pointer;

    :hover{
        opacity: 0.9;
        background-color: #340c36;
    }

    > h3 {
        font-weight: 500;
    }

    > h3 > span {
        padding: 15px;
    }
`;
