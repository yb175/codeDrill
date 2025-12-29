const ProfileAvatarDisplay = ({ firstLetter, size = "10", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center w-${size} h-${size} rounded-full bg-purple-600 text-white font-bold text-lg cursor-pointer`}
    >
      {firstLetter}
    </div>
  );
};

export default ProfileAvatarDisplay;
