import express from 'express';

import {
        deleteInvoice, invoices, newInvoive, searchCustomer,updateInvoice, 
        getUser, login, register,update,message,makePayment,
        getUserPayments,getInvoice,getPaymentData,getMessages,getUsers 

    } from '../controller/Controller.js';

const Routes = express.Router();

Routes.post('/login',login);
Routes.post('/register',register);
Routes.post('/create', newInvoive);
Routes.post('/invoices', invoices);
Routes.delete('/delete/:id', deleteInvoice);
Routes.post('/user',getUser);
Routes.post('/search', searchCustomer); // this one for searching the customer by their name ,email etc.. 
Routes.put('/update',update); // this one for update the company or user profile 
Routes.post('/message', message);
Routes.put('/updateInvoice', updateInvoice); // this one for updating invoice 
Routes.post('/payment',makePayment)
Routes.post('/payment-data',getUserPayments)
Routes.post('/getInvoice',getInvoice)
Routes.post('/getPaymentData',getPaymentData)
Routes.get('/users',getUsers)
Routes.post('/messages',getMessages);
export default Routes;
