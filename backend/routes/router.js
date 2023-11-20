var express = require("express");
var router = express.Router();

var mainCtrl = require("./../controller/controllers");
var passport = require("passport");

router.get("/", mainCtrl.redir);
router.get("/home", mainCtrl.home);

router.get("/home/login", mainCtrl.loginPage);
router.get("/home/register", mainCtrl.registerPage);

router.post("/home/register", mainCtrl.registerUser);
router.post("/home/login", mainCtrl.authenticate, mainCtrl.loginUser);
router.get("/home/logout", mainCtrl.logoutUser);
router.get("/home/user/:userid", mainCtrl.checkAuth, mainCtrl.userProfile);
router.get("/home/products/:productid", mainCtrl.productPage);
router.post("/home/products/:productid", mainCtrl.createOrder);
router.get("/home/cart", mainCtrl.cart);
router.get("/home/cart/checkout", mainCtrl.checkAuth, mainCtrl.checkOut)

module.exports = router;