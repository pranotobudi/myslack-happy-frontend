import React from 'react'
import SidebarOption from './SidebarOption.js';
import SidebarOptionEmail from './SidebarOptionEmail.js';
import styled from 'styled-components';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CreateIcon from '@mui/icons-material/Create';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AppsIcon from '@mui/icons-material/Apps';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Sidebar({websocket, userMongo}) {
    console.log("Sidebar comp")

    const [channels, updateChannels] = React.useState([]);
    const [user] = useAuthState(auth);
 
    React.useEffect(function effectFunction() {
        async function fetchChannels(){
            const response = await fetch(`${process.env.REACT_APP_EXTERNAL_HOST}/rooms`);
           const json = await response.json();
           updateChannels(json["data"]);
            console.log("response: ", json["data"])
        }
        fetchChannels();
    }, []); // This empty array represents an empty list of dependencies
 

 
    return (
        <SidebarContainer>
            <SidebarHeader>
                <SidebarInfo>
                    <h2>My Slack</h2>
                    <h3>
                        <FiberManualRecordIcon />
                        {/* Pranoto Budi */}
                        {user.displayName}
                    </h3>
                </SidebarInfo>
                <CreateIcon />
            </SidebarHeader>
{/* 
            <SidebarOption Icon={InsertCommentIcon} title="Threads" />
            <SidebarOption Icon={InboxIcon} title="Mentions & Reactions" />
            <SidebarOption Icon={DraftsIcon} title="Saved Items" />
            <SidebarOption Icon={BookmarkBorderIcon} title="Channel Browser" />
            <SidebarOption Icon={PeopleAltIcon} title="People & User groups" />
            <SidebarOption Icon={AppsIcon} title="Apps" />
            <SidebarOption Icon={FileCopyIcon} title="File Browser" />
            <SidebarOption Icon={ExpandLessIcon} title="Show Less" />
            <hr /> */}
            <SidebarOptionEmail Icon={InboxIcon} title="Mail This Chat" />
            <SidebarOption Icon={ExpandMoreIcon} title="Channels" />
            <hr />
            <SidebarOption Icon={AddIcon} addChannelOption title="Add Channel"  />

            {/* this is to handle rooms from backend connection */}
            {(!channels.length)?<></>:channels.map((room) => (
                <SidebarOption key={room.id} id={room.id} roomName={room.name}  title={room.name}  />
            ))}
            
        </SidebarContainer>
    )
}

const SidebarContainer = styled.div`
    color: white;
    background-color: var(--slack-color);
    flex: 0.3; 
    /* flex: 0.3; md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 */
    border-top: 1px solid #49274b;
    max-width: 260px;
    margin-top: 46px;

    >hr {
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px solid #49274b;
    }
`;

const SidebarHeader = styled.div`
    display: flex;
    border-bottom: 1px solid #49274b;
    padding: 13px;

    > .MuiSvgIcon-root {
        padding: 8px;
        color: #49274b;
        font-size:18px;
        background-color: white;
        border-radius:999px;
    }
`;

const SidebarInfo = styled.div`
    flex: 1;

    > h2 {
        font-size: 15px;
        font-weight: 900;
        margin-bottom: 5px;
    }

    > h3 {
        display: flex;
        font-size: 13px;
        font-weight: 400;
        align-items: center;
    }

    > h3 >  .MuiSvgIcon-root {
        font-size:18px;
        margin-top: 1px;
        margin-right: 2px;
        color: green;
    }
`;