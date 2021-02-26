import React from 'react';
import Logo from '../../assets/img/svg/groupbuy-logo.svg'

import './Header.css'

function Header() {
    return (
        <header className="py-4">
            <img className="py-2" src={Logo} alt="Groupbuy Logo"/>
        </header>
    )
}

export default Header;