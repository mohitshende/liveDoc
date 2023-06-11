import { signIn } from "next-auth/react";
import React from "react";
import DescriptionIcon from "@material-ui/icons/Description";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="overflow-hidden w-40 h-auto mb-4">
        <div className="text-[#2196f3] items-center flex flex-col">
          <DescriptionIcon className="!text-9xl" />
          <p className="text-xl text-gray-500">LiveDoc</p>
        </div>
      </div>
      <button
        onClick={signIn}
        className="py-2 w-44 shadow-md hover:animate-pulse text-gray-100 rounded-md bg-[#2196f3]"
      >
        Sign In
      </button>
    </div>
  );
};

export default Login;
