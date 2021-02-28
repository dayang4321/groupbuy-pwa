import React from 'react';
import Logo from '../../assets/img/svg/groupbuy-logo.svg'

import './Header.css'

function Header() {
    return (
        <header className="py-4 position-relative">
            <img className="py-2" src={Logo} alt="Groupbuy Logo" />
            <a  href className="contact-link d-none d-lg-inline-block position-absolute m-0 buyer-link">Buy products on <strong>groupbuy.ng</strong></a>   
        </header>
    )
}

export default Header;