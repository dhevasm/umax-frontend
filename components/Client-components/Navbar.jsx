'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import UserInfoLoading from "./Loading/UserInfoLoading";
import { BiBell, BiGroup, BiSolidMegaphone} from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { FaUser, FaUsers, FaCog, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Navbar() {
    
    const t = useTranslations('navbar');
    const tout = useTranslations('swal-logout');
    const pathName = usePathname();
    const router = useRouter();
    const [activeLink, setActiveLink] = useState(pathName);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const umaxUrl = process.env.NEXT_PUBLIC_API_URL;
    const roles = localStorage.getItem('roles');
    const [lang, setLang] = useState(roles != 'client' ? 'en' : localStorage.getItem('lang') || 'en');

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${umaxUrl}/user-by-id`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
            });
            response.data.Data.map(item => {
                setName(item.name);
                setEmail(item.email);
                setRole(item.roles);
                setImage(item.image);
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if(localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
            localStorage.setItem('color-theme', 'light');
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    const handleClick = (link) => {
        setActiveLink(link);
        router.push(`/${lang}${link}`);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsHidden(!isHidden);
    };

    function ProfileDropdown({ name, email, role, image }) {
        function handleLogout() {
            Swal.fire({
                title: `${tout('warn')}`,
                text: `${tout('msg')}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `${tout('yes')}`,
                cancelButtonText: `${tout('no')}`,
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('tenantId');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('name');
                    localStorage.removeItem('lang');
                    router.push('/');
                }
            });
        }
    
        return (
            <div className="text-black me-5 hover:cursor-pointer relative">
                <div className="flex items-center">
                    <Image src={`data:image/png;base64, ${image}`} alt="Profile" className="w-11 h-11 rounded-full mr-2" width={10} height={10} />
                    <h1 onClick={handleToggle} className="flex flex-col cursor-pointer">
                        <div className="text-sm flex gap-1 items-end font-medium">
                        <p className="dark:text-slate-100">{name}</p>
                        <span className="text-blue-500">
                            {isHidden ? <IoIosArrowDown size={18} className="font-semibold text-gray-800 dark:text-slate-200" /> : <IoIosArrowUp size={18} className="font-semibold text-black dark:text-slate-200" />}
                        </span>
                        </div>  
                        <div className="text-xs text-gray-500 dark:text-gray-400">{role}</div>
                    </h1>
                </div>
                <div className={`profile-dropdown ${isHidden ? 'hidden' : ''} absolute z-10 mt-3 -right-7 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg w-52 transition-all duration-300 ease-in-out`}>
                    <div className="flex flex-col mb-2">
                        <div className="flex justify-between">
                            <p className="font-bold text-[14px] text-gray-800 dark:text-slate-100">{name}</p>
                            <label htmlFor="theme" className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isDark} value="" id="theme" name="theme" className="sr-only peer" onChange={handleTheme} />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                            </label>
                        </div>
                        <p className="text-[12px] text-gray-500 dark:text-blue-500">{email}</p>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600"></div>
                    <Link href={`profile`} className="flex items-center px-4 py-4 text-[14px] text-gray-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors duration-200">
                        <FaUser className="mr-2" />
                        {t('profile')}
                    </Link>
                    
                    {role === 'admin' && (
                        <Link href={`admin-dashboard`} className="flex items-center px-4 py-4 text-[14px] text-gray-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors duration-200">
                            <FaTachometerAlt className="mr-2" />
                            Admin Dashboard
                        </Link>
                    )}
                    
                    <div className="border-t border-gray-300 dark:border-gray-600"></div>
                    <a onClick={handleLogout} className="flex items-center px-2 py-1 text-[14px] mt-2 text-red-600 dark:text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors duration-200">
                        <FaSignOutAlt className="mr-2" />
                        {t('logout')}
                    </a>
                </div>
            </div>
        );
    }

    function handleTheme(){
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
        localStorage.setItem('color-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }

    const changeLanguage = (lang) => {
        setLang(lang);
        router.push(`/${lang}${activeLink.slice(3)}`);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full p-3 bg-white dark:bg-slate-800 shadow-lg">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Image src="/assets/logo.png" alt="Logo" className="ms-4" width={130} height={10}/>
                    <div>
                        <ul className="hidden sm:hidden md:hidden lg:flex xl:flex p-2 text-black dark:text-slate-100 gap-5">
                            <style jsx>
                                {`
                                    .active-link {
                                        background-color: rgba(38, 100, 235);
                                        padding: 9px 16px;
                                        border-radius: 25px;
                                        color: white;
                                        transition: background-color 0.3s, color 0.3s;
                                    }
                                    ul li {
                                        padding: 9px 16px;
                                        border-radius: 25px;
                                        transition: background-color 0.3s, color 0.3s;
                                    }
                                    ul li:hover:not(.active-link) {
                                        cursor: pointer;
                                        background-color: rgba(0, 0, 255, 0.1);
                                        color: blue;
                                    }
                                    .dark ul li:hover:not(.active-link) {
                                        background-color: rgba(255, 255, 255, 0.1);
                                        color: white;
                                    }
                                `}
                            </style>
                            <li
                                className={`font-semibold flex gap-1 items-center ${
                                    activeLink.slice(3) === "/dashboard" ? "active-link" : ""
                                }`}
                                onClick={() => handleClick("/dashboard")}
                            >
                                <span>
                                    <MdDashboard size={20} />
                                </span>
                                {t("dashboard")}
                            </li>
                            <li
                                className={`font-semibold flex gap-1 items-center ${
                                    activeLink.slice(3) === "/campaigns" ? "active-link" : ""
                                }`}
                                onClick={() => handleClick("/campaigns")}
                            >
                                <span>
                                    <BiSolidMegaphone size={20} />
                                </span>
                                {t("campaign")}
                            </li>
                            <li
                                className={`font-semibold flex gap-1 items-center ${
                                    activeLink.slice(3) === "/accounts" ? "active-link" : ""
                                }`}
                                onClick={() => handleClick("/accounts")}
                            >
                                <span>
                                    <AiOutlineUser size={20} />
                                </span>
                                {t("account")}
                            </li>
                            {roles !== "client" && (
                                <li
                                    className={`font-semibold flex gap-1 items-center ${
                                        activeLink.slice(3) === "/clients" ? "active-link" : ""
                                    }`}
                                    onClick={() => handleClick("/clients")}
                                >
                                    <span>
                                        <BiGroup size={20} />
                                    </span>
                                    {t("client")}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Profile */}
                    <div className="flex gap-2 items-center">
                        {roles === 'client' && (
                            activeLink.includes("id") ? 
                                <button onClick={() => changeLanguage('en')} className="text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-5 py-2.5 me-5">
                                    {'ID'}
                                </button>
                            : 
                                <button onClick={() => changeLanguage('id')} className="text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-sm px-5 py-2.5 me-5">
                                    {'EN'}
                                </button>
                        )}
                        {/* <p className="text-white">{lang}</p> */}
                        <div className="relative text-black hidden sm:flex md:flex lg:flex xl:flex dark:text-slate-100 me-3 hover:cursor-pointer">
                            <div className="notif-dropdown hidden absolute z-10 mt-2 p-5 right-5 bg-white dark:bg-slate-700 rounded-lg shadow-lg flex-col gap-3 w-[200px]">
                            <a href="/" className="hover:bg-gray-100 dark:hover:bg-slate-600 p-2 rounded-lg">Notification 1</a>
                            <a href="/" className="hover:bg-gray-100 dark:hover:bg-slate-600 p-2 rounded-lg">Notification 2</a>
                            <a href="/" className="hover:bg-gray-100 dark:hover:bg-slate-600 p-2 rounded-lg">Notification 3</a>
                            </div>
                        </div>
                        {name === '' ? (
                            <UserInfoLoading />
                        ) : (
                            <ProfileDropdown name={name} email={email} role={role} image={image} />
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
