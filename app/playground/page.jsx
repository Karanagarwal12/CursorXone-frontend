"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Mapp from "../map/Map";
import Profile from "../profile/Profile";
import { io } from "socket.io-client";
import "./playground.scss";
import CanvasBg from "../canvasBg/CanvasBg";
import { Suspense } from "react";
import { useUserContext } from "../context/UserContext";
import Image from "next/image";
import tableimg from "../../assets/table.png";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

function Page() {
  // var pushToTalk = false;
  const [pushToTalk, setpushToTalk] = useState(false)
  const [emoji , setemoji] = useState(null);
  const pushToTalkRef = useRef(pushToTalk);
  const [curTable, setCurTable] = useState(-1);
  const cur = useRef();
  const outer = useRef();
  const { user, setUser, joinedUsers, setJoinedUsers } = useUserContext();
  const [table, setTable] = useState(null);
  const roomId = "123456";
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [clients, setClients] = useState([]);

  const myCursor = { x: 0, y: 0 };

  const allMouse = useRef();
  const localUserRef = useRef(null);
  const username = user?.name || localUserRef.current?.name;

  const curImg = user?.currentimage || localUserRef.current?.currentimage;

  const [messages, setmessages] = useState([{ text: "enter a message gloabally", username: "admin" }]);

  useEffect(() => {
    pushToTalkRef.current = pushToTalk;
  }, [pushToTalk]);
  useEffect(() => {
    localUserRef.current = localStorage.getItem("userD");
    if (localUserRef.current) {
      const parsedUser = JSON.parse(localUserRef.current);
      setUser(parsedUser);
    } else {
      if (!user) {
        router.push("/");
      }
    }
  }, [router]);

  const allMouseMove = (e) => {
    let childElementMap = e.mapParent.querySelector(`#${e.username}-map`);
    // cursors.set(e.username, e.cursorPos);
    if (childElementMap) {
      // If the child exists, apply the styles to it
      childElementMap.style.top = `${((e.cursorPos.y - 40) * 8) / 100}px`;
      childElementMap.style.left = `${((e.cursorPos.x - 17) * 8) / 100}px`;
    } else {
      // If the child doesn't exist, create a new element
      childElementMap = document.createElement("img");
      childElementMap.id = `${e.username}-map`;
      childElementMap.className = "otherCursorMap";
      childElementMap.src = curImg;

      // Apply the styles to the new element
      childElementMap.style.top = `${((e.cursorPos.y - 40) * 8) / 100}px`;
      childElementMap.style.left = `${((e.cursorPos.x - 17) * 8) / 100}px`;

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
      childElement = document.createElement("div");
      childElement.id = e.username;
      childElement.className = "otherCursor";
      setJoinedUsers((prev) => [...prev, e.username]);

      // Apply the styles to the new element
      childElement.style.top = `${e.cursorPos.y - 40}px`;
      childElement.style.left = `${e.cursorPos.x - 17}px`;

      // Append the new element to the parent element
      allMouse.current.appendChild(childElement);
    }
  };
  useEffect(() => {
    // const socketInstance = io('http://192.168.127.96:5000');
    // const socketInstance = io('http://103.209.145.248:3000');
    // const socketInstance = io("http://172.70.101.255:3000");
    // const socketInstance = io("http://localhost:3000");
    const socketInstance = io("http://192.168.112.96:3000");
    // const socketInstance = io('http://192.168.18.96:5000');
    // const socketInstance = io('http://172.70.100.243:5000');

    const mapParent = document.querySelector("#allCursPos");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      socketInstance.emit("join-room", { roomId, username });
    });

    socketInstance.on("user-left", (username) => {
      console.log(`${username} left the room`);
      setClients((prev) => prev.filter((user) => user !== username));
      // setCursorPositions(prevPositions => prevPositions.filter(item => item.username !== username));
      socketInstance.emit("connected-users", clients);
    });
    socketInstance.on("user-joined", (username) => {
      console.log(`${username} joined the room`);
      // setClients(prev => prev.filter(user => user !== username));
      // setCursorPositions(prevPositions => prevPositions.filter(item => item.username !== username));
      socketInstance.emit("connected-users", clients);
    });

    socketInstance.on("remote-cursor-move", ({ username, cursorPos , emoji }) => {
      // console.log(`Received cursor position for ${username}:`, cursorPos);
      allMouseMove({ username, cursorPos, mapParent });
    });
    socketInstance.on("messageResponse", ({ text, username }) => {
      setmessages([...messages, { text, username }]);
      console.log("message by ", username);
      console.log(text);
    })

    

    socketInstance.on("connected-users-table", (table) => {
      setTable(table);
      console.log(table);
      if (table.hasOwnProperty("1")) {
        let lengthOfArray1 = table["1"].length;
        console.log(lengthOfArray1);
      } else {
        console.log("Key '1' does not exist.");
      }
    });

    return () => {
      socketInstance.off("user-joined");
      socketInstance.off("connected-users");
      socketInstance.off("user-left");
      socketInstance.off("remote-cursor-move");
      socketInstance.disconnect();
    };
  }, [roomId, username]);

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (event) => {
      let htmlElem = document.querySelector("html");
      (myCursor.x = event.clientX), (myCursor.y = event.clientY);
      const cursorPos = {
        x: htmlElem.scrollLeft + event.clientX,
        y: htmlElem.scrollTop + event.clientY,
      };
      socket.emit("cursor-move", { roomId, username, cursorPos , emoji });
    };
    const emitOnScroll = (e) => {
      const cursorPos = {
        x: e.target.scrollingElement.scrollLeft + myCursor.x,
        y: e.target.scrollingElement.scrollTop + myCursor.y,
      };
      socket.emit("cursor-move", { roomId, username, cursorPos , emoji});
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("scroll", emitOnScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("scroll", handleMouseMove);
    };
  }, [socket, roomId, username , emoji]);

  const handleConnectedUsers = (users) => {
    setClients(users);
  };

  const leaveRoom = () => {
    if (!socket) return;
    socket.emit("leave-room", { roomId, username });
    router.push("/");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  useEffect(() => {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }, []);

  if (!localUserRef.current && !user) {
    return <div>Loading...</div>;
  }
  useEffect(() => {

  });

  const handleJoinTable = (tableId) => {
    console.log(curTable);
    if (curTable != -1) {
      // handleLeaveTable(curTable);
      setCurTable(tableId);
      console.log("koining table", tableId);
      console.log(tableId);
      // console.log(curTable);
      handletableclick(tableId);
    } else {
      console.log(tableId);
      setCurTable(tableId);
      console.log(curTable);
      handletableclick(tableId);
    }
  };
  const handletableclick = (tableId) => {
    console.log("clicked table ", tableId);

    socket.emit("join-table", { tableId, username });
    console.log("joining table")
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        // console.log(stream)
        var madiaRecorder = new MediaRecorder(stream);
        var audioChunks = [];

        madiaRecorder.addEventListener("dataavailable", function (event) {
          console.log("data ", pushToTalkRef.current);
          if (pushToTalkRef.current) {
            audioChunks.push(event.data);
          }
          // console.log(audioChunks);
        });

        madiaRecorder.addEventListener("stop", function () {
          var audioBlob = new Blob(audioChunks);
          audioChunks = [];
          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            var base64String = fileReader.result;
            if (pushToTalkRef.current) {
              console.log("emitung");
              socket.emit("audioStream", { base64String, tableId, username });
              console.log("emited")
            }
          };

          madiaRecorder.start();
          setTimeout(function () {
            madiaRecorder.stop();
          }, 1000);
        });
        madiaRecorder.start();
        setTimeout(function () {
          madiaRecorder.stop();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error capturing audio.", error);
      });
    socket.on("audioStream", (audioData) => {
      console.log("tab", audioData.tableId);
      console.log(audioData.base64String);
      console.log(audioData.username);
      console.log(audioData);

      if (audioData.username == username) {
        return;
      }
      audioData = audioData.base64String;
      var newData = audioData.split(";");
      console.log(newData);
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];

      var audio = new Audio(newData);
      console.log(audio);
      if (!audio || document.hidden || audio.src == "data:audio/ogg;base64,") {
        return;
      }

      audio.play();
    });

  };
  const handlegloabalMessage = () => {
    var text = "karan gandu";
    console.log("sending message");
    socket.emit('message-global', { text, username });
  }
  const handleLeaveTable = (tableId) => {
    console.log("leaving table ", tableId);
    socket.emit("leave-table", { tableId, username });
  };

  return (
    <div
      className="playground"
      onMouseEnter={() => (cur.current.style.display = "block")}
      onMouseLeave={() => (cur.current.style.display = "none")}
      onMouseMove={(e) =>
      (cur.current.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 40
        }px)`)
      }
    >
      {(user || localUserRef.current) && (
        <>
          <CanvasBg />
          <Image
            className="csr"
            src={curImg}
            alt="Cursor Image"
            width={100}
            height={100}
            ref={cur}
            priority
          />
          <div className="outer" ref={outer}>
            <div className="front">
              <Profile user={user || localUserRef.current} />
              <button onClick={() => {setpushToTalk(!pushToTalk);console.log(pushToTalk)}} className="pushTalk">{!pushToTalk && <MicOffIcon className="mic"/> || <MicIcon className="mic"/>}</button>
              <div className="mapCover">
                <Mapp />

              </div>
            </div>
          </div>
          <div className="allCursors" ref={allMouse}>
            {[1, 2, 3, 4, 5, 6].map(number => {
              const [isPeopleOpen, setIsPeopleOpen] = useState(false);
              return (
                <div key={number} className="table">
                  <div className="number" onClick={() => setIsPeopleOpen(prev => !prev)}>
                    {isPeopleOpen &&

                      ((table && table.hasOwnProperty(number) && table[number].length) ? table[number].map((person, i) => <div key={i} className="person">{person?.username}</div>) : "No User Connected")

                      ||
                      (table && table.hasOwnProperty(number) ? table[number].length : 0)
                    }
                  </div>
                  <Image
                    src={tableimg}
                    alt={`table ${number}`}
                    onClick={() => handleJoinTable(number)}
                    priority
                  />
                  <button
                    className="buttonleave"
                    onClick={() => handleLeaveTable(number)}
                  >
                    Leave table
                  </button>
                </div>
              );
            })}

          </div>
        </>
      )}
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
