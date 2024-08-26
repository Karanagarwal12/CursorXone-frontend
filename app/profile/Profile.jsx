import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './profile.scss';
import { useUserContext } from '../context/UserContext';

export default function Profile() {
    const { user, joinedUsers, setJoinedUsers, joinedUserDetails, setJoinedUserDetails } = useUserContext();
    const profile = useRef();
    const prImg = useRef();
    const [curUser, setCurUser] = useState(user);
    const [curUsername, setCurUsername] = useState(user?.name);
    const [isOpened, setIsOpened] = useState(false);
    const [userImages, setUserImages] = useState([]);

    // Update current user based on curUsername
    useEffect(() => {
        console.log("Current Username in Effect:", curUsername);
        if (curUsername && curUsername !== user?.name && joinedUserDetails) {
            const foundUser = joinedUserDetails[curUsername];
            if (foundUser) {
                setCurUser(foundUser);
            } else {
                console.error('User not found');
            }
        }
    }, [curUsername, user, joinedUserDetails]);

    // Fetch user images when curUser changes
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

    // Handle click on cursor elements
    const handleCurClick = (event) => {
        const elementId = event.target.id;
        // console.log("Handling Click:", curUsername, elementId);

        setCurUsername(elementId);  // Update username
        setIsOpened(prevState => !prevState);  // Toggle profile visibility
    };

    // Handle click on profile image
    const handleProfileClick = () => {
        setIsOpened(prevState => !prevState);
        if (!isOpened) {
            setCurUser(user);
            setCurUsername(user?.name);
        }
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
                element.removeEventListener('click', handleCurClick);
            });
        };
    }, [joinedUsers]);

    // Adjust profile display based on isOpened state
    useEffect(() => {
        if (profile.current) {
            profile.current.style.transform = isOpened ? 'translateX(0)' : 'translateX(-35vw)';
            // if (prImg.current) {
            //     prImg.current.style.opacity = isOpened ? 0 : 1;
            // }
        }
    }, [isOpened]);

    return (
        <div id="profile">
            <div className="profileDetail" ref={profile} onClick={handleProfileClick}>
                <div className="inner">
                    {isOpened && curUser && (
                        <>
                            <div className="name">{curUser.name.toUpperCase()}</div>
                            <div className="bio">{curUser.bio}</div>
                            <div className="links">
                                {curUser.socialLinks.map((link, i) => (
                                    <span key={i}>
                                        <a href={link.link}>{link.text}</a>
                                    </span>
                                ))}
                            </div>
                            <div>
                                {userImages.length > 0 && userImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`User Image ${index + 1}`}
                                        width={100}
                                        height={100}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className='profileImg'>
                <img
                    src={user?.currentimage}
                    alt="Profile Image"
                    width={100}
                    height={100}
                    ref={prImg}
                    onClick={handleProfileClick}
                />
            </div>
        </div>
    );
}
