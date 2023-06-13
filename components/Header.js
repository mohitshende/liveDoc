import React from "react";
import { IconButton } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="p-2 shadow-md sticky top-0 bg-white z-50">
      <div className="grid grid-cols-2 justify-between">
        <div className="text-[#2196f3] items-center space-x-2 ml-3 flex">
          <DescriptionIcon className="!text-3xl" />
          <p className="text-xl text-gray-500">LiveDoc</p>
        </div>

        <div className="flex items-center justify-end mr-4 gap-2">
          {/* <IconButton> */}
          <img
            src={session?.user.image}
            className="rounded-full h-[24px] w-[24px] "
            alt="User Avatar"
          />
          {/* </IconButton> */}
          <p
            className="text-bold text-sx cursor-pointer hover:text-blue-500"
            onClick={signOut}
          >
            Logout
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
