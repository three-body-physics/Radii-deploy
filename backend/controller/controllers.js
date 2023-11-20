var mongoose = require("mongoose");

// require passport packages

var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
//mongdb and schema configs

var productSchema = require("./../model/product.js");
var orderSchema = require("./../model/order.js");
var UserSchema = require("./../model/user.js");
var secret = require("./secret.js");

var session, Product, Order, User;

// var seed = require("./seeds.js");
// seed.seed(Product);

module.exports.connectDB = async function() {

    await mongoose.connect(secret.mongolabURL);

    Product = mongoose.model("Product", productSchema);
    Order = mongoose.model("Order", orderSchema);
    User = mongoose.model("User", UserSchema);

// passport strategy config

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

}

module.exports.authenticate = function(req, res, next) {

    passport.authenticate("local", { failureFlash: true }, function(err, user, info) {
        if (err) {

            return res.render("login", { error: err, loggedIn: false });

        }
        if (!user) {

            return res.render("login", { error: "Incorrect username/password.", loggedIn: false });
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            console.log(user);
            return next();
        });
    })(req, res, next);
}

module.exports.checkAuth = function(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/home/login");
}

module.exports.redir = function(req, res) {

    res.redirect("/home");

}

module.exports.home = function(req, res) {

    Product.find({}).then(prods => {
        res.render("heights", { products: prods, loggedIn: req.user });
    }).catch(err => {
        console.log(err);
    });

}

module.exports.loginPage = function(req, res) {

    if (req.isAuthenticated()) {
        return res.redirect("/home");
    }

    res.render("login", { error: false, loggedIn: false });
}

module.exports.registerPage = function(req, res) {

    if (req.isAuthenticated()) {
        return res.redirect("/home");
    }

    res.render("register", { error: false, loggedIn: false });
}

module.exports.loginUser = function(req, res) {

    res.redirect("/home/user/" + req.user._id);

}

module.exports.registerUser = function(req, res) {

    if (req.body.username.length < 8 || req.body.password.length < 8) {
        var error = { message: "Username and password have to be at least 8 characters in length." }
        return res.render("register", { error: error, loggedIn: false });
    }


    User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, function(err, user) {
        if (err) {

            var errObject = {
                success: false,
                message: "Registration failed: User or email already exists."
            };

            return res.render("register", { error: errObject, loggedIn: false });
        }

        passport.authenticate("local")(req, res, function() {
            res.redirect("/home");
        });
    });
}

module.exports.logoutUser = function(req, res) {
    req.logOut(function(err) {
        if (err) {
            return console.log(err);
        }   console.log("logged out");
        });

    req.session.destroy(function(err) {
        if (err) {
            return console.log(err);
        }   res.redirect("/home");
    })
}

module.exports.userProfile = function(req, res) {

    User.findById(req.user._id).populate({
        path: "orders",
        populate: {
            path: "products.product",
            model: "Product"
        }
    }).exec().then(user => {   
        
        res.render("account", { loggedIn: req.user, user: user });

    }).catch(err =>
        res.redirect("/login")
    );
}

module.exports.productPage = function(req, res) {

    var prodID = req.params.productid;

    Product.findById(prodID).then(product => {
        res.render("product", { product: product, loggedIn: req.user })
    }).catch(err => {
        res.redirect("/home");
    });
}

module.exports.createOrder = function(req, res) {

    session = req.session;


    Product.findById(req.params.productid).then(prod => {

        if (!session.order) {

            session.order = {
                price: prod.price * req.body.quantity,
                paid: false,
                products: [{
                    product: prod,
                    quantity: req.body.quantity
                }]
            };

        } else {

            session.order.products.push({ product: prod, quantity: req.body.quantity });
            session.order.price = session.order.price + (prod.price * req.body.quantity);

        }

        if (req.isAuthenticated()) {

            session.order.email = req.user.email;

        }


        res.redirect("/home/cart");


    }).catch(err => console.log(err));

}

module.exports.cart = function(req, res) {

    session = req.session;

    res.render("cart", { loggedIn: req.user, order: session.order });

}

module.exports.checkOut = function(req, res) {

    session = req.session;
    

    User.findById(req.user._id).populate("orders").exec().then(async function(user) {

        session.order.email = user.email;

        await Order.create(session.order).then(order => {     

            order.paid = true;
            order.save();            
            user.orders = user.orders.concat(order);
            console.log(user);                  
            user.save().then(user =>                
                res.redirect("/home/user/" + user._id)).catch(err =>  console.log(err)    
                  
         );      
        }).catch(err => console.log(err));
        
        session.order = null;        

    }).catch(err => console.log(err));

}