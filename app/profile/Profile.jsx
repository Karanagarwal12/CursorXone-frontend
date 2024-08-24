import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import './profile.scss';
import { useUserContext } from '../context/UserContext';

export default function Profile(user) {
    const { joinedUsers, setJoinedUsers, joinedUserDetails, setJoinedUserDetails } = useUserContext();
    const profile = useRef();
    const prImg = useRef();
    const [curUser, setCurUser] = useState(user?.user);
    const [curUsername, setCurUsername] = useState(user?.user?.name);
    const [isOpened, setIsOpened] = useState(false);
    const [userImages, setUserImages] = useState(null);
    useEffect(() => {
        if (curUsername && curUsername !== user?.user?.name && joinedUserDetails && joinedUserDetails[0]) {
            const foundUser = joinedUserDetails.find((user) => user?.name === curUsername);

            if (foundUser) {
                setCurUser(foundUser);
            }
        }
    }, [curUsername, user, joinedUserDetails]);


    useEffect(() => {
        if (curUser) {
            axios.post('http://103.209.145.248:3000/cursors/get', { userid: curUser._id })
                .then(response => {
                    const imageStrings = response.data.body.map(item => item.imagebase64);
                    setUserImages(imageStrings);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [curUser]);

    const handleCurClick = (event) => {
        const elementId = event.target.id;
        console.log(elementId);
        if (curUsername == elementId) {
            setIsOpened(true);
        } else {
            setIsOpened(false);
        }
        setCurUsername(elementId);
    };
    useEffect(() => {
        const elements = document.querySelectorAll('.otherCursor');

        elements.forEach(element => {
            element.addEventListener('click', handleCurClick);
        });

        if (joinedUsers.length > 0) {
            const newJoinedUser = joinedUsers[joinedUsers.length - 1]; // Get the last user added

            if (!joinedUserDetails[newJoinedUser]) { // Check if the user details are not already fetched
                axios.post('http://103.209.145.248:3000/users/', { username: newJoinedUser })
                    .then(response => {
                        elements[elements.length - 1].style.background = `url(${response.data.body?.currentimage}) no-repeat`;
                        elements[elements.length - 1].style.backgroundSize = `contain`;
                        document.getElementById(`${newJoinedUser}-map`).src = response.data.body?.currentimage;
                        setJoinedUserDetails(prevDetails => ({
                            ...prevDetails,
                            [newJoinedUser]: response.data.body,
                        }));
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }
        }
        // Cleanup event listeners when the component unmounts
        return () => {
            elements.forEach(element => {
                element.removeEventListener('click', handleClick);
            });
        };
    }, [joinedUsers]);

    useEffect(() => {
        if (isOpened) {
            profile.current.style.height = '0vh';
            profile.current.style.width = '0vw';
            profile.current.style.padding = '0vw';
            prImg.current.style.opacity = 1;
        } else {
            profile.current.style.height = '90vh';
            profile.current.style.width = '30vw';
            profile.current.style.padding = '2vw';
            prImg.current.style.opacity = 0;
        }
    }, [isOpened])

    return (
        <div id="profile" onClick={() => setIsOpened(!isOpened)}>
            <div className="inner" ref={profile} >
                {isOpened && <>
                    <div className="name">{curUser?.name.toUpperCase()}</div>
                    <div className="bio">{curUser?.bio}</div>
                    <div className="links">
                        {curUser?.socialLinks.map((link, i) => <span key={i}><a href={link.link}>{link.text}</a></span>)}
                    </div>
                    <div>
                        {userImages && userImages?.length > 0 && (
                            userImages.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image}
                                    alt={`User Image ${index + 1}`}
                                    width={100} // Specify the desired width
                                    height={100} // Specify the desired height
                                />
                            ))
                        )}
                    </div>
                </>
                }
            </div>
            <Image
                src={user?.user?.currentimage}
                alt="Profile Image"
                width={100}
                height={100}
                ref={prImg}
            />

        </div>
    )
}