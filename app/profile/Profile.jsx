import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
                <Image
                    src={user?.user?.currentimage}
                    alt="Profile Image"
                    width={100}
                    height={100}
                />
            }
        </div>
    )
}