import React, { useState } from 'react';
import invoiceImg from '../../asset/invoice.png';
const InvoiceSection = () => {
    const [showAccordion, setShowAccordion] = useState(false);

    const toggleAccordion = () => setShowAccordion(!showAccordion);

    return (
        <div className="invoice-section-container">
            <div className="invoice-content">
                <div>
                    <h3 className="invoice-title">Create invoices in less than 10 seconds</h3>
                    <p className="invoice-description">
                        AIMPS helps you track your sales, manage inventory, customers & vendors, and stay in control of your business. Create GST compliant invoices & share them easily with customers.
                    </p>
                    <div className="accordion">
                        <div className="accordion-title" onClick={toggleAccordion}>
                            <span>Read more</span>
                        </div>
                        <div className={`accordion-content ${showAccordion ? 'show' : ''}`}>
                            <h3>Unlimited Invoices, Purchase Orders, Quotations, Delivery Challans using AIMPS.</h3>
                            <p>AIMPS is the best billing software for creating GST-compliant bills. Small businesses can grow with AIMPS, keeping their accounts and books updated.</p>
                            <p>AIMPS free GST billing Software offers a complete solution for creating instant bills and increasing productivity professionally.</p>
                        </div>
                    </div>
                    <div className="button-container">
                        <a
                            href="https://play.google.com/store/apps/details?id=in.AIMPS.app"
                            className="button hidden-mobile"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Create Invoices for FREE
                        </a>
                        <a
                            href="https://app.getAIMPS.in/auth/login"
                            className="button hidden-desktop"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Create Invoices for FREE
                        </a>
                    </div>
                </div>
                <div className="image-container">
                    <img
                        src={invoiceImg}
                        alt="Sales Dashboard AIMPS billing inventory accounting GST"
                    />
                </div>
            </div>
        </div>
    );
};

export default InvoiceSection;
