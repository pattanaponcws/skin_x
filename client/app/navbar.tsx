"use client";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "./components/auth-povider";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();

  const router = useRouter();

  return (
    <div className="w-screen fixed z-50 bg-white">
      <div className="flex justify-between items-center border-b-1 border-b-neutral-400/40 px-10 py-4">
        <div className=" flex items-center space-x-4">
          <h1
            className=" font-extrabold text-3xl cursor-pointer"
            onClick={() => router.push("/")}
          >
            POSTS
          </h1>
        </div>
        {user?.email ? (
          <div className=" flex justify-center items-center space-x-4">
            <div>{user?.email ? <>{user.email}</> : <></>}</div>
            <div>
              <button
                onClick={() => logout()}
                className=" bg-red-600 text-white px-2 py-1 font-bold rounded-2xl cursor-pointer hover:bg-red-400 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className=" bg-green-600 text-white px-2 py-1 font-bold rounded-2xl cursor-pointer hover:bg-green-400 transition-all duration-300"
          >
            Log in
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
