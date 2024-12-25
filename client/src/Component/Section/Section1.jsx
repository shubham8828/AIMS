import React from 'react';
import { Link } from 'react-router-dom';

const BillingAppSection = () => {
    return (
        <div className="billing-section">
            <h2 className="title">Simple Billing and Payments App</h2>
            <p className="description">
                AIMPS is a free GST billing software, helping you track your sales, purchases & estimates in real-time. With AIMPS, you can easily manage your inventoryand create & share professional invoices.
            </p>
            <div className="button-container">
               
                <Link
                    to="/login"
    
                    className="button hidden-desktop"
                >
                    Sign up for Free
                </Link>
            </div>
        </div>
    );
};

export default BillingAppSection;
