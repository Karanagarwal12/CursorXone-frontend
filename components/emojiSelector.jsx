import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const emojis = [
  {
    key: "1f600",
    value: "😀"
  },
  {
    key: "1f603",
    value: "😃"
  },
  {
    key: "1f604",
    value: "😄"
  },
  {
    key: "1f601",
    value: "😁"
  },
  {
    key: "1f606",
    value: "😆"
  },
  {
    key: "1f605",
    value: "😅"
  },
  {
    key: "1f602",
    value: "😂"
  },
  {
    key: "1f923",
    value: "🤣"
  },
  {
    key: "1f62d",
    value: "😭"
  },
  {
    key: "1f609",
    value: "😉"
  },
  {
    key: "1f617",
    value: "😗"
  },
  {
    key: "1f619",
    value: "😙"
  },
  {
    key: "1f61a",
    value: "😚"
  },
  {
    key: "1f618",
    value: "😘"
  },
  {
    key: "1f970",
    value: "🥰"
  },
  {
    key: "1f60d",
    value: "😍"
  },
  {
    key: "1f929",
    value: "🤩"
  },
  {
    key: "1f973",
    value: "🥳"
  },
  {
    key: "1fae0",
    value: "🫠"
  },
  {
    key: "1f643",
    value: "🙃"
  },
  {
    key: "1f642",
    value: "🙂"
  },
  {
    key: "1f972",
    value: "🥲"
  },
  {
    key: "1f979",
    value: "🥹"
  },
  {
    key: "1f60a",
    value: "😊"
  },
  {
    key: "1f60c",
    value: "😌"
  },
  {
    key: "1f60f",
    value: "😏"
  },
  {
    key: "1f634",
    value: "😴"
  },
  {
    key: "1f62a",
    value: "😪"
  },
  {
    key: "1f924",
    value: "🤤"
  },
  {
    key: "1f60b",
    value: "😋"
  },
  {
    key: "1f61b",
    value: "😛"
  },
  {
    key: "1f61d",
    value: "😝"
  },
  {
    key: "1f61c",
    value: "😜"
  },
  {
    key: "1f92a",
    value: "🤪"
  },
  {
    key: "1f974",
    value: "🥴"
  },
  {
    key: "1f614",
    value: "😔"
  },
  {
    key: "1f97a",
    value: "🥺"
  },
  {
    key: "1f62c",
    value: "😬"
  },
  {
    key: "1f611",
    value: "😑"
  },
  {
    key: "1f610",
    value: "😐"
  },
  {
    key: "1f636",
    value: "😶"
  },
  {
    key: "1fae5",
    value: "🫥"
  },
  {
    key: "1f910",
    value: "🤐"
  },
  {
    key: "1fae1",
    value: "🫡"
  },
  {
    key: "1f914",
    value: "🤔"
  },
  {
    key: "1f92b",
    value: "🤫"
  },
  {
    key: "1fae2",
    value: "🫢"
  },
  {
    key: "1f92d",
    value: "🤭"
  },
  {
    key: "1f971",
    value: "🥱"
  },
  {
    key: "1f917",
    value: "🤗"
  },
  {
    key: "1fae3",
    value: "🫣"
  },
  {
    key: "1f631",
    value: "😱"
  },
  {
    key: "1f928",
    value: "🤨"
  },
  {
    key: "1f9d0",
    value: "🧐"
  },
  {
    key: "1f612",
    value: "😒"
  },
  {
    key: "1f644",
    value: "🙄"
  },
  {
    key: "1f624",
    value: "😤"
  },
  {
    key: "1f620",
    value: "😠"
  },
  {
    key: "1f621",
    value: "😡"
  },
  {
    key: "1f92c",
    value: "🤬"
  },
  {
    key: "1f61e",
    value: "😞"
  },
  {
    key: "1f613",
    value: "😓"
  },
  {
    key: "1f61f",
    value: "😟"
  },
  {
    key: "1f625",
    value: "😥"
  },
  {
    key: "1f622",
    value: "😢"
  },
  {
    key: "1f641",
    value: "🙁"
  },
  {
    key: "1fae4",
    value: "🫤"
  },
  {
    key: "1f615",
    value: "😕"
  },
  {
    key: "1f630",
    value: "😰"
  },
  {
    key: "1f628",
    value: "😨"
  },
  {
    key: "1f627",
    value: "😧"
  },
  {
    key: "1f626",
    value: "😦"
  },
  {
    key: "1f62e",
    value: "😮"
  },
  {
    key: "1f62f",
    value: "😯"
  },
  {
    key: "1f632",
    value: "😲"
  },
  {
    key: "1f633",
    value: "😳"
  },
  {
    key: "1f92f",
    value: "🤯"
  },
  {
    key: "1f616",
    value: "😖"
  },
  {
    key: "1f623",
    value: "😣"
  },
  {
    key: "1f629",
    value: "😩"
  },
  {
    key: "1f62b",
    value: "😫"
  },
  {
    key: "1f635",
    value: "😵"
  },
  {
    key: "1fae8",
    value: "🫨"
  },
  {
    key: "1f976",
    value: "🥶"
  },
  {
    key: "1f975",
    value: "🥵"
  },
  {
    key: "1f922",
    value: "🤢"
  },
  {
    key: "1f92e",
    value: "🤮"
  },
  {
    key: "1f927",
    value: "🤧"
  },
  {
    key: "1f912",
    value: "🤒"
  },
  {
    key: "1f915",
    value: "🤕"
  },
  {
    key: "1f637",
    value: "😷"
  },
  {
    key: "1f925",
    value: "🤥"
  },
  {
    key: "1f607",
    value: "😇"
  },
  {
    key: "1f920",
    value: "🤠"
  },
  {
    key: "1f911",
    value: "🤑"
  },
  {
    key: "1f913",
    value: "🤓"
  },
  {
    key: "1f60e",
    value: "😎"
  },
  {
    key: "1f978",
    value: "🥸"
  },
  {
    key: "1f921",
    value: "🤡"
  },
  {
    key: "1f608",
    value: "😈"
  },
  {
    key: "1f47f",
    value: "👿"
  },
  {
    key: "1f47b",
    value: "👻"
  },
  {
    key: "1f383",
    value: "🎃"
  },
  {
    key: "1f4a9",
    value: "💩"
  },
  {
    key: "1f916",
    value: "🤖"
  },
  {
    key: "1f47d",
    value: "👽"
  },
  {
    key: "1f31b",
    value: "🌛"
  },
  {
    key: "1f31c",
    value: "🌜"
  },
  {
    key: "1f31e",
    value: "🌞"
  },
  {
    key: "1f525",
    value: "🔥"
  },
  {
    key: "1f4af",
    value: "💯"
  },
  {
    key: "1f31f",
    value: "🌟"
  },
  {
    key: "1f4a5",
    value: "💥"
  },
  {
    key: "1f389",
    value: "🎉"
  },
  {
    key: "1f648",
    value: "🙈"
  },
  {
    key: "1f649",
    value: "🙉"
  },
  {
    key: "1f64a",
    value: "🙊"
  },
  {
    key: "1f63a",
    value: "😺"
  },
  {
    key: "1f638",
    value: "😸"
  },
  {
    key: "1f639",
    value: "😹"
  },
  {
    key: "1f63b",
    value: "😻"
  },
  {
    key: "1f63c",
    value: "😼"
  },
  {
    key: "1f63d",
    value: "😽"
  },
  {
    key: "1f640",
    value: "🙀"
  },
  {
    key: "1f63f",
    value: "😿"
  },
  {
    key: "1f63e",
    value: "😾"
  },
  {
    key: "1f9e1",
    value: "🧡"
  },
  {
    key: "1f49b",
    value: "💛"
  },
  {
    key: "1f49a",
    value: "💚"
  },
  {
    key: "1fa75",
    value: "🩵"
  },
  {
    key: "1f499",
    value: "💙"
  },
  {
    key: "1f49c",
    value: "💜"
  },
  {
    key: "1f90e",
    value: "🤎"
  },
  {
    key: "1f5a4",
    value: "🖤"
  },
  {
    key: "1fa76",
    value: "🩶"
  },
  {
    key: "1f90d",
    value: "🤍"
  },
  {
    key: "1fa77",
    value: "🩷"
  },
  {
    key: "1f498",
    value: "💘"
  },
  {
    key: "1f49d",
    value: "💝"
  },
  {
    key: "1f496",
    value: "💖"
  },
  {
    key: "1f497",
    value: "💗"
  },
  {
    key: "1f493",
    value: "💓"
  },
  {
    key: "1f49e",
    value: "💞"
  },
  {
    key: "1f495",
    value: "💕"
  },
  {
    key: "1f48c",
    value: "💌"
  },
  {
    key: "1f494",
    value: "💔"
  },
  {
    key: "1f48b",
    value: "💋"
  },
  {
    key: "1f463",
    value: "👣"
  },
  {
    key: "1fac0",
    value: "🫀"
  },
  {
    key: "1fa78",
    value: "🩸"
  },
  {
    key: "1f9a0",
    value: "🦠"
  },
  {
    key: "1f480",
    value: "💀"
  },
  {
    key: "1f440",
    value: "👀"
  },
  {
    key: "1fae6",
    value: "🫦"
  },
  {
    key: "1f9bf",
    value: "🦿"
  },
  {
    key: "1f9be",
    value: "🦾"
  },
  {
    key: "1f4aa",
    value: "💪"
  },
  {
    key: "1f44f",
    value: "👏"
  },
  {
    key: "1f44d",
    value: "👍"
  },
  {
    key: "1f44e",
    value: "👎"
  },
  {
    key: "1f64c",
    value: "🙌"
  },
  {
    key: "1f44b",
    value: "👋"
  },
  {
    key: "1f91e",
    value: "🤞"
  },
  {
    key: "1f64f",
    value: "🙏"
  },
  {
    key: "1f483",
    value: "💃"
  },
  {
    key: "1f339",
    value: "🌹"
  },
  {
    key: "1f940",
    value: "🥀"
  },
  {
    key: "1f342",
    value: "🍂"
  },
  {
    key: "1f331",
    value: "🌱"
  },
  {
    key: "1f340",
    value: "🍀"
  },
  {
    key: "1f30b",
    value: "🌋"
  },
  {
    key: "1f305",
    value: "🌅"
  },
  {
    key: "1f304",
    value: "🌄"
  },
  {
    key: "1f308",
    value: "🌈"
  },
  {
    key: "26a1",
    value: "⚡"
  },
  {
    key: "1f4ab",
    value: "💫"
  },
  {
    key: "1f30d",
    value: "🌍"
  },
  {
    key: "1f984",
    value: "🦄"
  },
  {
    key: "1f98e",
    value: "🦎"
  },
  {
    key: "1f409",
    value: "🐉"
  },
  {
    key: "1f996",
    value: "🦖"
  },
  {
    key: "1f422",
    value: "🐢"
  },
  {
    key: "1f40d",
    value: "🐍"
  },
  {
    key: "1f438",
    value: "🐸"
  },
  {
    key: "1f407",
    value: "🐇"
  },
  {
    key: "1f400",
    value: "🐀"
  },
  {
    key: "1f415",
    value: "🐕"
  },
  {
    key: "1f416",
    value: "🐖"
  },
  {
    key: "1f40e",
    value: "🐎"
  },
  {
    key: "1facf",
    value: "🫏"
  },
  {
    key: "1f402",
    value: "🐂"
  },
  {
    key: "1f410",
    value: "🐐"
  },
  {
    key: "1f998",
    value: "🦘"
  },
  {
    key: "1f405",
    value: "🐅"
  },
  {
    key: "1f412",
    value: "🐒"
  },
  {
    key: "1f9a6",
    value: "🦦"
  },
  {
    key: "1f987",
    value: "🦇"
  },
  {
    key: "1f413",
    value: "🐓"
  },
  {
    key: "1f423",
    value: "🐣"
  },
  {
    key: "1f424",
    value: "🐤"
  },
  {
    key: "1f425",
    value: "🐥"
  },
  {
    key: "1f985",
    value: "🦅"
  },
  {
    key: "1fabf",
    value: "🪿"
  },
  {
    key: "1f99a",
    value: "🦚"
  },
  {
    key: "1f9ad",
    value: "🦭"
  },
  {
    key: "1f42c",
    value: "🐬"
  },
  {
    key: "1f433",
    value: "🐳"
  },
  {
    key: "1f421",
    value: "🐡"
  },
  {
    key: "1f980",
    value: "🦀"
  },
  {
    key: "1f419",
    value: "🐙"
  },
  {
    key: "1fabc",
    value: "🪼"
  },
  {
    key: "1f40c",
    value: "🐌"
  },
  {
    key: "1f41c",
    value: "🐜"
  },
  {
    key: "1f99f",
    value: "🦟"
  },
  {
    key: "1f41d",
    value: "🐝"
  },
  {
    key: "1f98b",
    value: "🦋"
  },
  {
    key: "1f43e",
    value: "🐾"
  },
  {
    key: "1f345",
    value: "🍅"
  },
  {
    key: "1f37f",
    value: "🍿"
  },
  {
    key: "1f37b",
    value: "🍻"
  },
  {
    key: "1f942",
    value: "🥂"
  },
  {
    key: "1f37e",
    value: "🍾"
  },
  {
    key: "1f377",
    value: "🍷"
  },
  {
    key: "1f379",
    value: "🍹"
  },
  {
    key: "1f6a8",
    value: "🚨"
  },
  {
    key: "1f6f8",
    value: "🛸"
  },
  {
    key: "1f680",
    value: "🚀"
  },
  {
    key: "1f6eb",
    value: "🛫"
  },
  {
    key: "1f6ec",
    value: "🛬"
  },
  {
    key: "1f3a2",
    value: "🎢"
  },
  {
    key: "1f38a",
    value: "🎊"
  },
  {
    key: "1f388",
    value: "🎈"
  },
  {
    key: "1f382",
    value: "🎂"
  },
  {
    key: "1f386",
    value: "🎆"
  },
  {
    key: "1faa9",
    value: "🪩"
  },
  {
    key: "26bd",
    value: "⚽"
  },
  {
    key: "1f3af",
    value: "🎯"
  },
  {
    key: "1f3bb",
    value: "🎻"
  },
  {
    key: "1f941",
    value: "🥁"
  },
  {
    key: "1fa87",
    value: "🪇"
  },
  {
    key: "1f50b",
    value: "🔋"
  },
  {
    key: "1faab",
    value: "🪫"
  },
  {
    key: "1f4b8",
    value: "💸"
  },
  {
    key: "1f4a1",
    value: "💡"
  },
  {
    key: "1f393",
    value: "🎓"
  },
  {
    key: "1f48e",
    value: "💎"
  },
  {
    key: "23f0",
    value: "⏰"
  },
  {
    key: "1f514",
    value: "🔔"
  },
  {
    key: "274c",
    value: "❌"
  },
  {
    key: "1f3b6",
    value: "🎶"
  },
  {
    key: "1f192",
    value: "🆒"
  },
  {
    key: "1f3c1",
    value: "🏁"
  },
  {
    key: "2615",
    value: "☕"
  },
  {
    key: "2705",
    value: "✅"
  },
  {
    key: "2728",
    value: "✨"
  },
  {
    key: "2648",
    value: "♈"
  },
  {
    key: "2649",
    value: "♉"
  },
  {
    key: "2650",
    value: "♐"
  },
  {
    key: "2651",
    value: "♑"
  },
  {
    key: "2652",
    value: "♒"
  },
  {
    key: "2653",
    value: "♓"
  },
  {
    key: "2795",
    value: "➕"
  },
  {
    key: "264a",
    value: "♊"
  },
  {
    key: "264b",
    value: "♋"
  },
  {
    key: "264c",
    value: "♌"
  },
  {
    key: "264d",
    value: "♍"
  },
  {
    key: "264e",
    value: "♎"
  },
  {
    key: "264f",
    value: "♏"
  },
  {
    key: "26ce",
    value: "⛎"
  }
];

const EmojiDropdown = ({
  isDropdownOpen,
  toggleDropdown,
  selectedEmoji,
  handleEmojiSelect
}) => {
  const currentEmoji =
    emojis?.find((emoji) => emoji.key === selectedEmoji)?.value || "";

  return (
    <div className={`emoji-dropdown inn ${isDropdownOpen ? "open" : ""}`}>
      <div className="emoji-dropdown-trigger" onClick={toggleDropdown}>
        {currentEmoji}
      </div>
      {isDropdownOpen && (
        <div className="emoji-list">
          {emojis.map(({ key, value }) => (
            <span
              key={key}
              className={`emoji ${selectedEmoji === key ? "selected" : ""}`}
              onClick={() => handleEmojiSelect(key)}
            >
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const EmojiDisplay = ({ selectedEmoji  }) => {
  return (
    <div className="selected-emoji" >
      {selectedEmoji && (
        <div key={selectedEmoji}>
          {/* <h1>{selectedEmoji}</h1> */}
          <DotLottieReact
            src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${selectedEmoji}/lottie.json`}
            loop
            autoplay
          />
        </div>
      )}
    </div>
  );
};

// const EmojiSelector = () => {
//   const [selectedEmoji, setSelectedEmoji] = useState("1f92f");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleEmojiSelect = (unicodeValue) => {
//     setSelectedEmoji(unicodeValue);
//     setIsDropdownOpen(false);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prevIsOpen) => !prevIsOpen);
//   };

//   return (
//     <div className="emoji-selector">
//       <h2>Select an Emoji...</h2>
//       <EmojiDropdown
//         isDropdownOpen={isDropdownOpen}
//         toggleDropdown={toggleDropdown}
//         emojis={emojis}
//         selectedEmoji={selectedEmoji}
//         handleEmojiSelect={handleEmojiSelect}
//       />
//       {!isDropdownOpen && <EmojiDisplay selectedEmoji={selectedEmoji} />}
//     </div>
//   );
// };

export { EmojiDropdown, EmojiDisplay };