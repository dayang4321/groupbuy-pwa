import React from 'react';
import{ ReactComponent as Mail} from '../../assets/img/svg/mail.svg'
import { ReactComponent as Phone } from '../../assets/img/svg/phone.svg'

import FooterLogo from '../../assets/img/svg/groupbuy-shop.svg'
import './Footer.css'
import { Col, Row } from 'react-bootstrap';

function Footer() {

    return(
        <footer>
            <Row className="mt-3 d-flex flex-column flex-md-row align-items-center mb-4 mb-md-5 justify-content-center">
                <Col lg={{span:3, order: 0}} className="text-xl-right my-4 my-md-3"><a  className="contact-link" href="mailto:hello@declutter.ng"><i><Mail className="mr-3"/></i>hello@painless.ng</a></Col>
                <Col lg={{span:3, order: 2}} className="text-xl-left my-4 my-md-3"><a  className="contact-link mb-3" href="tel:+2348136526089"><i><Phone className="mr-3" /></i>08136526089</a></Col>                
                <Col lg={{span:4, order: 1}} className="text-xl-center my-5  my-md-4"><a  href className="contact-link mt-4 buyer-link">Buy products on <strong>groupbuy.ng</strong></a>    </Col>             
            </Row>
            <img src={FooterLogo} alt="Gropubuy" />
            <div className="d-flex flex-column text-center painless-text mb-5">
                <span>by</span>
                <span>PAINLESS</span>
            </div>
            <p>Copyright &copy; {new Date().getFullYear()}. Groupbuy</p>
            <a href="https://declutter.ng/index.php?route=pages/terms_seller" className="contact-link d-block mt-4 t-c">Terms &amp; Conditions</a>
    </footer>)
}

export default Footer;