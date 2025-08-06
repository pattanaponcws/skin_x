"use client";

import React, { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../components/auth-povider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [see, setSee] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);

  const { login, status } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (status !== undefined && status !== 200) {
      setErr(true);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="text-center w-full h-[80vh] flex items-center justify-center ">
      <div className=" border p-10 border-gray-400/20 rounded-3xl w-2/6 h-1/2">
        <h1 className="text-2xl font-bold mb-10">LOGIN</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className=" flex flex-col space-y-10">
            <input
              id="email"
              placeholder="email or username"
              className="p-2 border border-gray-400/20 rounded-md w-full"
              type="text"
              onChange={(e) => {
                setEmail(e.target.value);
                setErr(false);
              }}
            />
            <div className="relative">
              <input
                id="password"
                placeholder="password"
                className="p-2 pr-10 border border-gray-400/20 rounded-md w-full font-sans text-base tracking-normal"
                type={see ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErr(false);
                }}
              />
              <div
                className=" absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSee(!see)}
              >
                {see ? <IoEye /> : <IoEyeOff />}
              </div>
            </div>
            <div className=" relative">
              {err && (
                <p className="text-red-500 text-sm absolute top-[-20px]">
                  Invalid username or password
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 mt-2 mb-2 rounded-md font-bold cursor-pointer hover:text-black hover:bg-white transition-all duration-300 ease-in-out"
              >
                Login
              </button>
              <p>
                No Account{" "}
                <span
                  onClick={() => {
                    router.push("/register");
                  }}
                  className=" text-blue-600 cursor-pointer hover:text-blue-400 transition-all duration-300 ease-in-out "
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
