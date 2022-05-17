import React, { useEffect, useRef, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/solid";
import { useSelector } from "react-redux";
import SideBar from "./SideBar";

import { useNavigate } from "react-router-dom";

const Header = () => {
    const items = useSelector((state) => state.ProductsSlice.added_products);

    const navigate = useNavigate();
    const [isSideBarOpened, setisSideBarOpened] = useState(false);

    return (
        <div className="w-full fixed top-0 left-0 right-0 bg-white shadow-sm select-none">
            <div className="w-10/12   flex items-center justify-between h-[72px] mx-auto cursor-pointer">
                <img
                    src="/images/logo.svg"
                    alt=""
                    className=" h-full select-none"
                    onClick={() => navigate("/")}
                />

                {/* <button onClick={() => handleSignIn()}>
                    {user ? "LogOut" : "Login"}
                </button>

                {user && <img src={user.photoURL} alt="" className="w-5 h-5" onClick={()=>signOutUSer()}/>} */}
                <div
                    className=" w-8 relative select-none"
                    onClick={() => setisSideBarOpened(!isSideBarOpened)}
                >
                    <ShoppingCartIcon className="text-gray-400 cursor-pointer hover:animate-pulse " />
                    <span className="absolute w-6 h-6 -top-3  -right-6 bg-emerald-200 rounded -full flex items-center justify-center text-gray-900 text-xs select-none">
                        {items.length}
                    </span>
                </div>
            </div>

            <SideBar
                isSideBarOpened={isSideBarOpened}
                setisSideBarOpened={setisSideBarOpened}
            />
        </div>
    );
};

export default Header
