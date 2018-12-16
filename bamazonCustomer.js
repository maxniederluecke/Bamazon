var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "vegetable",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected as id: " + connection.threadId);
	viewItems();
});

function viewItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		console.log("Available Items:");
		for (i = 0; i < res.length; i++) {
			console.log("Item ID: " + res[i].item_id + " | Name: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: $" + res[i].price + " | Quantity: " + res[i].stock_quantity);
		}
	});
	purchaseItems();
}

function purchaseItems() {
	inquirer.prompt([{
		type: "input",
		message: "What is the ID of the product you would like to buy?",
		name: "inputId"
	}, {
		type: "input",
		message: "How many would you like to buy?",
		name: "inputQty"
	}]).then(function(answer) {
		connection.query("SELECT * FROM products WHERE item_id = ?", [answer.inputId], function(err, res) {
			if (err) throw err;
			if (answer.inputQty > res.stock_quantity) {
				console.log("Insufficient Quantity!")
			} else {
				console.log("Your order was successful! Total price: $" + (res[0].price * answer.inputQty));
				connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: (res.stock_quantity - answer.inputQty)}, {item_id: answer.inputId}], function(err, res) {
					if (err) throw err;
					console.log("Thank you for your purchase!");
				})
			}
		})
	})
}


