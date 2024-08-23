import { useEffect, useRef, useState } from 'react';
import './profile.scss';

export default function Profile(user) {
    const profile = useRef();
    const [isOpened, setIsOpened] = useState(false);
    const handleClick = (e) => {
        setIsOpened(true);
    }
    return (
        <div id="profile" ref={profile} onClick={handleClick}>
            {isOpened &&
                <div className="inner">
                    
                </div> || 
                <img src={user?.user?.currentimage} alt="cursorImage" />
            }
        </div>
    )
}