const ProfileAvatarDisplay = ({ firstLetter, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-lg cursor-pointer"
    >
      {firstLetter}
    </div>
  );
};

export default ProfileAvatarDisplay;
