const Product = require('../../model/product');
const CartModel = require('../../model/cart');
const path = require('path');
const fs = require('fs');

class ProductController {

    // POST API 
    async create(req, res) {
        try {
            // This code is for uploading image with validation
            if (!req.file) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter image it is required"]
                });
            }
            // Validation for size 
            if (req.body.p_size.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter size it is required"]
                });
            }
            // Validation for color 
            if (req.body.p_color.length < 1) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter color it is required"]
                });
            }

            // Handle Array for p_color and p_size
            const p_sizes = Array.isArray(req.body.p_size) ? req.body.p_size : req.body.p_size.split(',').map(size => size.trim());
            const p_colors = Array.isArray(req.body.p_color) ? req.body.p_color : req.body.p_color.split(',').map(color => color.trim());


            const productdata = new Product({ ...req.body, p_size: p_sizes, p_color: p_colors, image: req.file.path }); // Assign the image path for validation

            const data = await productdata.save();
            res.status(200).json({ message: "Product added successfully", data });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // GET API 
    async getall(req, res) {
        try {
            const data = await Product.find();
            res.status(200).json({
                succes: true,
                message: "Product list Fetched successfully",
                total: data.length,
                products: data
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving product data" });
        }
    }

    // GET Single API
    async getsingle(req, res) {
        const id = req.params.id;
        try {
            const data = await Product.findById(id);
            if (data) {
                res.status(200).json({ message: "Single data fetched", data });
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving product data" });
        }
    }

    // Update Data
    async productupdate(req, res) {
        const id = req.params.id;
        // Validation for size
        if (req.body.p_size.length < 1) {
            return res.status(400).json({
                message: "Validation error",
                errors: ["Please enter Size it is required"]
            });
        }

        // Validation for color 
        if (req.body.p_color.length < 1) {
            return res.status(400).json({
                message: "Validation error",
                errors: ["Please enter color it is required"]
            });
        }
        // Deleting image from uploads folder start
        if (req.file) {
            const product = await Product.findById(id); // Find product by id
            const imagePath = path.resolve(__dirname, '../../../', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    } else {
                        console.log('Image file deleted successfully:', product.image);
                    }
                });
            } else {
                console.log('File does not exist:', imagePath);
            }
        }
        // Deleting image from uploads folder end
        try {

            // Handle Array for p_color and p_size
            const p_sizes = Array.isArray(req.body.p_size) ? req.body.p_size : req.body.p_size.split(',').map(size => size.trim());
            const p_colors = Array.isArray(req.body.p_color) ? req.body.p_color : req.body.p_color.split(',').map(color => color.trim());

            const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.body, p_size: p_sizes, p_color: p_colors }, { new: true, runValidators: true }
            );

            // File Handling Area 
            if (req.file) {
                updatedProduct.image = req.file.path
                await updatedProduct.save(); // Save the document with the updated image
            }


            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "Error updating product data" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // DELETE Api For Delete product
    async productdelete(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const product = await Product.findById(id); // Find product by id
        const imagePath = path.resolve(__dirname, '../../../', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', product.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            res.status(deletedProduct ? 200 : 404).json(
                deletedProduct ? { message: "Product deleted successfully" } : { message: "Product not found" }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting product" });
        }
    }

    // Add cart
    async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            if (!userId || !productId) {
                return res.status(400).json({ message: 'User ID and Product ID are required' });
            }
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            let cart = await CartModel.findOne({ userId });
            if (cart) {
                // Check if the product is already in the cart
                const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
                if (productIndex > -1) {
                    // Update quantity
                    cart.products[productIndex].quantity += quantity || 1;
                } else {
                    // Add new product to the cart
                    cart.products.push({ productId, quantity: quantity || 1 });
                }
            } else {
                // Create a new cart for the user
                cart = new CartModel({
                    userId,
                    products: [{ productId, quantity: quantity || 1 }]
                });
            }
            await cart.save();
            res.status(200).json({ message: 'Cart item added', cart });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }


    // Get cart value 
    async getcart(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
    
            // Find the user's cart
            let cart = await CartModel.findOne({ userId }).populate('products.productId', 'p_name p_size p_color price image p_description brand');
    
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
    
            // Filter out products with null references (deleted products)
            cart.products = cart.products.filter(product => product.productId !== null);
    
            if (cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty or contains only deleted products' });
            }
    
            // Calculate total value for each product in the cart
            const cartWithTotalValue = {
                userId: cart.userId,
                products: cart.products.map(product => {
                    const totalprice = product.quantity * product.productId.price; // quantity * price
                    return {
                        productId: product.productId._id,
                        name: product.productId.p_name,
                        size: product.productId.p_size,
                        color: product.productId.p_color,
                        price: product.productId.price,
                        image: product.productId.image,
                        p_description: product.productId.p_description,
                        brand: product.productId.brand,
                        quantity: product.quantity,
                        totalprice: totalprice, // Add the total value field
                    };
                }),
            };
    
            res.status(200).json({
                message: 'Cart retrieved successfully',
                cart: cartWithTotalValue,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
    


    // Decrease cart
    async decreaseCartItem(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            if (!userId || !productId || quantity === undefined) {
                return res.status(400).json({ message: 'User ID, Product ID, and quantity are required' });
            }
            // Check if the product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // Check if the user already has a cart
            let cart = await CartModel.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found for this user' });
            }
            // Check if the product is in the cart
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            // Decrease the quantity of the product in the cart
            cart.products[productIndex].quantity -= quantity || 1;

            // If the quantity becomes zero or less, remove the product from the cart
            if (cart.products[productIndex].quantity <= 0) {
                cart.products.splice(productIndex, 1);  // Remove the product from the cart
            }

            // Save the updated cart
            await cart.save();

            // Populate the cart to include full product details
            const populatedCart = await CartModel.findById(cart._id).populate(
                'products.productId', 'p_name p_size p_color price image p_description brand'
            );

            // Calculate the total price of the updated cart
            let totalCartPrice = 0;
            populatedCart.products.forEach(item => {
                totalCartPrice += item.totalPrice;  // Add up the total price of each product
            });

            // Send the response
            res.status(200).json({
                message: 'Cart item remove',
                cart: populatedCart,
                totalCartPrice,  // Include the total price of the cart in the response
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

}

module.exports = new ProductController();






