'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Mapp from '../map/Map';
import { io } from 'socket.io-client';
import '../cursors/cursor.scss';
import './playground.scss';
import CanvasBg from '../canvasBg/CanvasBg';
import { Suspense } from 'react';

function Page() {

  const cur = useRef();
  const outer = useRef();

  const roomId = '123456';
  const router = useRouter();
  const searchpara = useSearchParams();
  const username = searchpara.get('username');

  const [socket, setSocket] = useState(null);
  const [clients, setClients] = useState([]);
  const myCursor = { x: 0, y: 0 };
  // useEffect(() => {
  //   console.log(cursors);
  // }, [cursors])
  const allMouse = useRef();
  const allMouseMove = (e) => {
    let childElementMap = e.mapParent.querySelector(`#${e.username}`);
    // cursors.set(e.username, e.cursorPos);
    if (childElementMap) {
      // If the child exists, apply the styles to it
      childElementMap.style.top = `${(e.cursorPos.y - 40) * 8 / 100}px`;
      childElementMap.style.left = `${(e.cursorPos.x - 17) * 8 / 100}px`;
    } else {
      // If the child doesn't exist, create a new element
      childElementMap = document.createElement('div');
      childElementMap.id = e.username;
      childElementMap.className = 'otherCursorMap';

      // Apply the styles to the new element
      childElementMap.style.top = `${(e.cursorPos.y - 40) * 8 / 100}px`;
      childElementMap.style.left = `${(e.cursorPos.x - 17) * 8 / 100}px`;

      // Append the new element to the parent element
      e.mapParent.appendChild(childElementMap);
    }
    let childElement = allMouse.current.querySelector(`#${e.username}`);
    if (e.username == username) return;
    if (childElement) {
      // If the child exists, apply the styles to it
      childElement.style.top = `${e.cursorPos.y - 40}px`;
      childElement.style.left = `${e.cursorPos.x - 17}px`;
    } else {
      // If the child doesn't exist, create a new element
      childElement = document.createElement('div');
      childElement.id = e.username;
      childElement.className = 'otherCursor';

      // Apply the styles to the new element
      childElement.style.top = `${e.cursorPos.y - 40}px`;
      childElement.style.left = `${e.cursorPos.x - 17}px`;

      // Append the new element to the parent element
      allMouse.current.appendChild(childElement);
    }
  }
  useEffect(() => {
    // const socketInstance = io('http://192.168.127.96:5000');
    const socketInstance = io('https://1895-2409-40e3-9-48ea-e63c-51b8-a76f-88ef.ngrok-free.app');
    // const socketInstance = io('http://192.168.18.96:5000');
    // const socketInstance = io('http://172.70.100.243:5000');

    
    const mapParent = document.querySelector('#allCursPos');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      socketInstance.emit('join-room', { roomId, username });
    });


    socketInstance.on('user-left', (username) => {
      console.log(`${username} left the room`);
      setClients(prev => prev.filter(user => user !== username));
      setCursorPositions(prevPositions => prevPositions.filter(item => item.username !== username));
      socketInstance.emit('connected-users', clients);
    });

    socketInstance.on('remote-cursor-move', ({ username, cursorPos }) => {
      // console.log(`Received cursor position for ${username}:`, cursorPos);
      allMouseMove({ username, cursorPos, mapParent });
    });

    return () => {
      socketInstance.off('user-joined');
      socketInstance.off('connected-users');
      socketInstance.off('user-left');
      socketInstance.off('remote-cursor-move');
      socketInstance.disconnect();
    };
  }, [roomId, username]);

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (event) => {
      let htmlElem = document.querySelector('html');
      myCursor.x = event.clientX, myCursor.y = event.clientY;
      const cursorPos = { x: (htmlElem.scrollLeft + event.clientX), y: (htmlElem.scrollTop + event.clientY) };
      socket.emit('cursor-move', { roomId, username, cursorPos });
    };
    const emitOnScroll = (e) => {
      const cursorPos = { x: (e.target.scrollingElement.scrollLeft + myCursor.x), y: (e.target.scrollingElement.scrollTop + myCursor.y) };
      socket.emit('cursor-move', { roomId, username, cursorPos });
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', emitOnScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleMouseMove);
    };
  }, [socket, roomId, username]);

  const handleConnectedUsers = (users) => {
    setClients(users);
  };

  const leaveRoom = () => {
    if (!socket) return;
    socket.emit('leave-room', { roomId, username });
    router.push('/');
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  useEffect(() => {
    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
    
  }, []);

  return (
    <div className="playground">
      <CanvasBg/>
      <div className="allCursors" ref={allMouse}></div>
      <div
        className="outer"
        ref={outer}
        onMouseEnter={() => (cur.current.style.display = 'block')}
        onMouseLeave={() => (cur.current.style.display = 'none')}
        onMouseMove={(e) => (cur.current.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 40}px)`)}
      >
        <Mapp />
        <div className="csr" ref={cur}></div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}