import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import './profile.scss';

export default function Profile(user) {
    const profile = useRef();
    const prImg = useRef();
    const [curUser, setCurUser] = useState(user?.user);
    const [curUsername, setCurUsername] = useState(user?.user?.name);
    const [isOpened, setIsOpened] = useState(false);
    const [userImages, setUserImages] = useState(null);
    useEffect(() => {
        if (curUsername) {

            axios.post('http://103.209.145.248:3000/cursors/get', { username: curUsername })
                .then(response => {
                    const imageStrings = response.data.body.map(item => item.imagebase64);
                    console.log("called");
                    setUserImages(imageStrings);
                })
                .catch(error => {
                    console.log("called");
                    console.error('Error fetching data:', error);
                });

            if (curUsername !== user?.user?.name) {
                axios.post('http://103.209.145.248:3000/users/', { username: curUsername })
                    .then(response => {
                        setCurUser(response.data.body);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            }

        }
    }, [curUsername, user]);

    useEffect(() => {
        const elements = document.querySelectorAll('.otherCursor');

        const handleClick = (event) => {
            const elementId = event.target.id;
            if (curUsername == elementId) {
                setIsOpened(false);
            } else {
                setIsOpened(true);
            }
            setCurUsername(elementId);
        };

        elements.forEach(element => {
            element.addEventListener('click', handleClick);
        });

        // Cleanup event listeners when the component unmounts
        return () => {
            elements.forEach(element => {
                element.removeEventListener('click', handleClick);
            });
        };
    }, []);

    const handleClick = (e) => {
        setIsOpened(!isOpened);
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
    }
    return (
        <div id="profile" onClick={handleClick}>
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