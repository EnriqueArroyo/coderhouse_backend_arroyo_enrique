import express from "express";
const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended:true}));

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.incrementarID();
  }

  static incrementarID() {
    if (this.idIncrement) {
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }
}

import { promises as fs } from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // --------------------------------- METHODS ------

  addProduct = async (productDetails) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    if (products.some((product) => product.code === productDetails.code)) {
      console.error("The product with this code already exists");
      return;
    }

    const product = new Product(
      productDetails.title,
      productDetails.description,
      productDetails.price,
      productDetails.thumbnail,
      productDetails.code,
      productDetails.stock
    );
    products.push(product);
    await fs.writeFile(this.path, JSON.stringify(products));
  };

  getProducts = async () => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    console.log(products);
    return products
  };

  getProductsByID = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prodByID = products.find((prod) => prod.id === id);
    console.log("Search result:");
    prodByID ? console.log(prodByID) : console.log("ERROR: The product with id " + id + " does not exist");

    return prodByID;
  };

  updateProduct = async (id, productDetails) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((prod) => prod.id === id);

    if (index !== -1) {
      const product = new Product(
        productDetails.title,
        productDetails.description,
        productDetails.price,
        productDetails.thumbnail,
        productDetails.code,
        productDetails.stock
      );
      product.id = id; // Asegurándonos de que el ID se mantenga
      products[index] = product;
      await fs.writeFile(this.path, JSON.stringify(products));
      console.log("Product edited:");
      console.log(product);
    } else {
      console.log("ERROR: The product with id " + id + " does not exist");
    }
  };

  deleteProduct = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const updatedProducts = products.filter((prod) => prod.id !== id);
    await fs.writeFile(this.path, JSON.stringify(updatedProducts));
  };
}

const pm = new ProductManager("./src/products.txt");


app.get("/products", async (req, res) => {
  try {
    const {pid, title, description, price, thumbnail, code, stock, limit} = req.query;

    const products = await pm.getProducts();
    let filtredProducts = products.filter(product =>
      (pid ? product.id == pid : true) && 
      (title ? product.title === title : true) &&
      (description ? product.description === description : true) &&
      (price ? product.price == price : true) && 
      (thumbnail ? product.thumbnail === thumbnail : true) &&
      (code ? product.code === code : true) &&
      (stock ? product.stock == stock : true) 
    );

    if (limit) {
      filtredProducts = filtredProducts.slice(0, parseInt(limit));
    }

    console.log(req.query);
    res.send(filtredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error obteniendo los productos');
  }
});

app.get("/productos/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    console.log(pid);
    const product = await pm.getProductsByID(pid);
    res.send(product);
  } catch (error) {
    console.error(error);
    res.send('Error obteniendo el producto por ID');
  }
});



app.get("/", (req, res) => {
  res.send("jorge");
});

  app.get("/index.html", (req, res) => {
    res.send("jorge");
  });


  app.get("*", (req, res) => {
    res.send("Error 404");
  });


  app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
  });
  
