var products = [
{
	img: "/img/p5.jpg",
	label: "Breeze",
	price: 39.99
},
{
	img: "/img/p3.jpg",
	label: "Biker",
	price: 49.99
},
{
	img: "/img/p7.jpg",
	label: "Ruby",
	price: 29.99
},
{
	img: "/img/p4.jpg",
	label: "Winter",
	price: 29.99
},
{
	img: "/img/p2.jpg",
	label: "SWISS",
	price: 19.99
},
{
	img: "/img/p8.jpg",
	label: "Bronze",
	price: 48.99
},
{
	img: "/img/p6.jpg",
	label: "Eskimos",
	price: 64.99
},
{
	img: "/img/p1.jpg",
	label: "Silhouette",
	price: 24.99
}
]



module.exports.seed = function(product) {

	products.forEach(p => {
		product.create(p).then(pro => {
		
				console.log(pro);
			}).catch(err => console.log(err));
		})
	}
