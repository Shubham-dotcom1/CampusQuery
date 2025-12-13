import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white border-b p-4">
            <Link to="/">Home</Link>
        </nav>
    );
};
export default Navbar;
