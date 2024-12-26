import Invoice from "../model/InvoiceSchema.js"; // Ensure the correct path to your Invoice model
import User from "../model/User.js";
import Message from "../model/Message.js";
import bcrypt from "bcrypt"; // To hash the password
import jwt from "jsonwebtoken"; // To generate JWT tokens
import cloudinary from "../cloudinary.js";
import Payment from "../model/payment.js";

export const newInvoive = async (req, res) => {
  try {
    // Extract bill data from the request body
    const { to, phone, address, products, total, email } = req.body;

    // Create a new bill instance
    const newInvoice = new Invoice({
      to,
      phone,
      address,
      products,
      total,
      email,
    });

    // Save the new bill to the database
    await newInvoice.save();
    res
      .status(200)
      .json({ msg: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    // Handle errors and send an error response
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get all invoice at one time this is for Invoices page
export const invoices = async (req, res) => {
  try {
    const email = req.body.email;

    // Query the database with pagination
    const invoices = await Invoice.find({ email });

    res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};  

// delete invoice

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the invoice by ID and delete it
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Return success message
    res.json({ msg: "Invoice deleted successfully", invoice: deletedInvoice });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update the invoice

export const updateInvoice = async (req, res) => {
  // Extract `id` and other updated data from `req.body`
  const { id, ...updatedInvoiceData } = req.body;

  try {
    // Update the invoice in the database
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      updatedInvoiceData, // Pass the rest of the data to update the document
      { new: true } // Return the updated document
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Send a success response with the updated invoice
    res
      .status(200)
      .json({
        message: "Invoice updated successfully",
        invoice: updatedInvoice,
      });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search Customer By Name
// Search Customer By Name
export const searchCustomer = async (req, res) => {
  try {
    const { query, email } = req.body;

    // Check if userEmail is provided
    if (!email) {
      return res.status(400).json({ msg: "Missing user email" });
    }

    // Fetch all invoices for the user
    const invoices = await Invoice.find({ email });
    // console.log("All invoices:", invoices); // Log invoices for debugging

    // If no invoices are found, return an empty object
    if (!invoices.length) {
      return res.status(200).json({ invoices: [] });
    }

    // If query is not provided, return all invoices with selected fields
    if (!query) {
      const selectedFields = invoices.map((invoice) => ({
        invoiceId: invoice.invoiceId,
        to: invoice.to,
        email: invoice.email,
        phone: invoice.phone,
        total: invoice.total,
        date: invoice.date,
        address: invoice.address,
      }));
      return res.status(200).json({ invoices: selectedFields });
    }

    const searchRegex = new RegExp(query, "i"); // Create a case-insensitive regex

    // Filter invoices based on the search query and select only required fields
    const filteredInvoices = invoices
      .filter((invoice) => {
        return (
          (invoice.to && searchRegex.test(invoice.to)) || // Check for 'to' field
          (invoice.phone && searchRegex.test(invoice.phone)) || // Check for 'phone' field
          (invoice.invoiceId && searchRegex.test(invoice.invoiceId)) || // Check for 'invoiceId' field
          (invoice.email && searchRegex.test(invoice.email)) || // Check for 'email' field
          (invoice.address && searchRegex.test(invoice.address)) // Check for 'address' field
        );
      })
      .map((invoice) => ({
        // Map to return only the required fields
        invoiceId: invoice.invoiceId,
        to: invoice.to,
        phone: invoice.phone,
        email: invoice.email, // Added email to the response
        address: invoice.address, // Added address to the response
        total: invoice.total,
        date: invoice.date,
      }));

    // console.log("Filtered invoices:", filteredInvoices); // Log filtered results for debugging

    // Return filtered invoices wrapped in an object
    res
      .status(200)
      .json({ invoices: filteredInvoices.length > 0 ? filteredInvoices : [] });
  } catch (error) {
    console.error("Error in search API:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Register API For User
export const register = async (req, res) => {
  const { email, name, address, password, image, phone } = req.body;

  try {
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ msg: "User already registered" });
    }

    // Uploading image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      upload_preset: "eeeghag0",
      public_id: `${email}_avatar`,
      allowed_formats: ["png", "jpg", "jpeg", "svg"],
    });

    // Check for upload result
    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ msg: "Image upload failed" });
    }

    // Fetch optimized URL (if needed)
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email,
      name,
      phone,
      address,
      password: hashedPassword, // Store the hashed password
      image: optimizeUrl, // Store the optimized URL or use uploadResult.secure_url
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET // Use your secret key for signing the token
    );

    // Send response with token and user data
    res.status(200).json({
      msg: "User registered successfully",
      token, // JWT token
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login API For User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body)
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an error
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate a JWT token if the credentials are correct
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET // Use your JWT secret key
    );

    // Return a success response with the token
    return res.status(200).json({ msg: "Login successful", token, user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Update API For User
export const update = async (req, res) => {
  try {
    const id = req.body._id; // User ID from the body
    const { email, name, address, image } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    // console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update individual user fields
    if (email) user.email = email;
    if (name) user.name = name;

    // Update individual address fields
    if (address) {
      const { city, state, pin, other } = address;

      if (city) user.address.city = city;
      if (state) user.address.state = state;
      if (pin) user.address.pin = pin;
      if (other) user.address.other = other;
    }

    // Handle image upload if an image is provided
    if (image) {
      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        upload_preset: "eeeghag0",
        public_id: `${email}_avatar`,
        overwrite: true,  
        allowed_formats: ["png", "jpg", "jpeg", "svg"],
      });

      // Check if the upload was successful and set the secure_url to user.image
      if (!uploadResult || !uploadResult.secure_url) {
        return res.status(500).json({ msg: "Image upload failed" });
      }

      user.image = uploadResult.secure_url; // Save the secure_url directly
    }

    // Save the updated user
    await user.save();

    // Return success response with updated user data
    return res.status(200).json({ msg: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};


// GetUserDate API For User

export const getUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(500).json({ msg: "user Not found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


//------------------------------- Save Payment Data API ------------------------------

export const makePayment = async (req, res) => {
  try {
    const {
      paymentId,
      customerName,
      amount,
      currency,
      paymentStatus,
      paymentDate,
      paymentMethod,
      invoiceId,
      remarks,
      cardDetails,
    } = req.body.transactionData;

    // Validate required fields
    if (
      !paymentId ||
      !customerName ||
      !amount ||
      !currency ||
      !paymentStatus ||
      !paymentDate ||
      !paymentMethod ||
      !invoiceId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Construct the payment object
    const paymentData = {
      paymentId,
      customerName,
      amount,
      currency,
      paymentStatus,
      paymentDate,
      paymentMethod,
      invoiceId,
      remarks,
    };

    // Add card details only if the payment method is 'Card'
    if (paymentMethod === "Card") {
      if (
        !cardDetails ||
        !cardDetails.cardNumber ||
        !cardDetails.expiry ||
        !cardDetails.cvv
      ) {
        return res
          .status(400)
          .json({ error: "Missing card details for Card payment method" });
      }
      paymentData.cardDetails = {
        cardNumber: cardDetails.cardNumber,
        expiryDate: cardDetails.expiry,
        cvv: cardDetails.cvv,
      };
    }

    // Save the payment record to the database
    const paymentRecord = new Payment(paymentData);
    await paymentRecord.save();

    // Respond to the client
    res.status(201).json({
      message: "Payment processed successfully",
      data: paymentRecord,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
};

// ----------------------- Return Payment Data Or List ------------------------------------

// Import Payment model.
export const getUserPayments = async (req, res) => {
  const { email } = req.body; // Extract email from the request body.
  // console.log(email);

  try {
    // Step 1: Find all invoices created by the user.
    const userInvoices = await Invoice.find({ email });

    if (userInvoices.length === 0) {
      return res
        .status(404)
        .json({ message: "No invoices found for this user." });
    }

    // Extract all invoice IDs.
    const invoiceIds = userInvoices.map((invoice) => invoice.invoiceId);

    // Step 2: Find all payments matching the user's invoice IDs.
    const payments = await Payment.find({ invoiceId: { $in: invoiceIds } });

    // Map the payments by invoiceId for quick lookup.
    const paymentMap = new Map(
      payments.map((payment) => [payment.invoiceId, payment])
    );

    // Step 3: Combine invoice and payment data.
    const combinedData = userInvoices.map((invoice) => {
      if (paymentMap.has(invoice.invoiceId)) {
        // If a payment exists for this invoice, use the payment data and add phone number.
        return {
          ...paymentMap.get(invoice.invoiceId)._doc,
          customerPhone: invoice.phone || "N/A",
        };
      } else {
        // If no payment exists, create a "pending" payment object with invoice details.
        return {
          invoiceId: invoice.invoiceId,
          paymentId: "N/A",
          customerName: invoice.to || "N/A",
          customerPhone: invoice.phone || "N/A",
          amount: invoice.total || "N/A",
          currency: "INR",
          paymentStatus: "Pending",
          paymentDate: "N/A",
          paymentMethod: "N/A",
          cardDetails: "N/A",
        };
      }
    });

    // Step 4: Return the combined data.
    res.status(200).json({
      message: "Payments fetched successfully.",
      data: combinedData,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      message: "An error occurred while fetching user payments.",
      error,
    });
  }
};

// ------------------ Find Invoice By Invoice ID ----------------

export const getInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.body; // Extract invoiceID from the request body
    // console.log(req.body);
    // Check if the invoiceID is provided
    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    // Find the invoice by invoiceID
    const invoice = await Invoice.findOne({ invoiceId: invoiceId });

    // If no invoice is found
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Return the invoice data
    return res.status(200).json({ invoice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------ Find Payment Data By Invoice ID ----------------

export const getPaymentData = async (req, res) => {
  const { invoiceId } = req.body; // Extract invoiceId from the request body

  try {
    // Find the payment data using the invoiceId
    const payment = await Payment.findOne({ invoiceId });

    // If payment is not found, return 404 status with a message
    // if (!payment) {
    //   res.status(404).json({ message: "Payment data not found" });
    // }

    // Return the found payment data
    return res.status(200).json(payment);
  } catch (error) {
    // If there's an error with the database query, return a 500 status
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



// ----------------   get All Users ----------------------


export const getUsers = async (req, res) => {

  try {
    const users=await User.find()
    if(!users){
      return res.status(404).json({message:"User Not Found "})
    }
    else{
      return res.status(200).json({users})

    }
    
  } catch (error) {
    
  }
}

// --------------------------- Get all messages of one conversation---------------------

export const getMessages = async (req, res) => {
  try {
        const { sender, receiver} = req.body;
        // Check if any required field is missing
        if (!sender || !receiver ) {
          return res.status(400).json({ error: "Missing Sender, Receiver" });
        }
    
        // Find an existing conversation between sender and receiver
        let conversation = await Message.findOne({
          $or: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender }
          ]
        });
    
        // If conversation exists, add the new message to the conversation's message array
        if (conversation) {
          return res.status(200).json({conversation})
        }
        else{
          return res.status(404).json({error:"Conversation Not Found"})
        }
  }
  catch(error ){

  }

}

// -------------------- Customer Support API -------------------------
export const newMessages = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
        console.log(req.body)
    // Check if any required field is missing
    if (!sender || !receiver ) {
      return res.status(400).json({ error: "Missing Sender, Receiver, or Message" });
    }

    // Find an existing conversation between sender and receiver
    let conversation = await Message.findOne({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender }
      ]
    });

    // If conversation exists, add the new message to the conversation's message array
    if (conversation) {
      const currentTime = new Date(); // Create a valid Date object

      // Add each message to the conversation
      if(message.length === 0 ){
          return res.status(500).json({error:" Message Cant Empty"})
      }else{

      
      message.forEach(msg => {
        conversation.message.push({
          msg: msg.msg,
          createdAt: currentTime, // Store a Date object
          sender: msg.sender
        });
      });
    }

      // Save the updated conversation
      await conversation.save();
      console.log('Message(s) added to existing conversation');
      return res.status(200).json({ message: 'Message(s) added to existing conversation' });
    } else {
      // If no conversation exists, create a new conversation
      const currentTime = new Date(); // Create a valid Date object

      const newConversation = new Message({
        sender,
        receiver,
        message: message.map(msg => ({
          msg: msg.msg,
          createdAt: currentTime, // Store a Date object
          sender: msg.sender
        }))
      });

      // Save the new conversation
      await newConversation.save();
      console.log('New conversation created and message(s) added');
      return res.status(201).json({ message: 'New conversation created and message(s) added' });
    }
  } catch (error) {
    console.error('Error adding message:', error);
    return res.status(500).json({ error: 'Error adding message', details: error.message });
  }
};

