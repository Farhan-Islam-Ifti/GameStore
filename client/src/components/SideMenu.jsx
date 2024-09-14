import React from 'react';
import { HiExclamationCircle } from "react-icons/hi";
import { HiFolder } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";
import { HiOutlineCollection } from "react-icons/hi";
import { Link } from 'react-router-dom';
import './sideMenu.css';

export default function SideMenu() {
  return (
    <div className='sideMenu'>
      <ul className="nav">
        <li>
          <Link to="/category">
            <i><HiFolder /></i><span className='navName'>Category</span>
          </Link>
        </li>
        <li>
          <Link to="/library">
            <i><HiOutlineCollection /></i><span className='navName'>Library</span>
          </Link>
        </li>
        <li>
          <Link to="/favourite">
            <i><HiHeart /></i><span className='navName'>Favourite</span>
          </Link>
        </li>
        <li>
          <Link to="/aboutus">
            <i><HiExclamationCircle /></i><span className='navName'>About Us</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/add-game">
            <i><HiExclamationCircle /></i><span className='navName'>Add</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
