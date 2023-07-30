import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  calculateLastID = async (product) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    if (products.length === 0) {
      return 1;
    } else {
      let maxId = products.reduce(
        (max, product) => Math.max(max, product.id),
        0
      );
      return maxId + 1;
    }
  };

  // --------------------------------- METHODS ------- VV
  addProduct = async ({
    description,
    title,
    price,
    thumbnail,
    code,
    stock,
  }) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Missed adding a field");
      return;
    }

    // Checking for duplicate code
    if (this.products.some((product) => product.code === code)) {
      console.error("The product with this code already exists");
      return;
    }

    const id = await this.calculateLastID(products);

    products.push({ id, description, title, price, thumbnail, code, stock });
    await fs.writeFile(this.path, JSON.stringify(products));
  };

  getProducts = async () => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    console.log(products);
  };

  getProductsByID = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prodByID = products.find((prod) => prod.id === id);
    console.log("Search result:");
    (prodByID) ? console.log(prodByID) : console.log("ERROR: The product with id " + id + " does not exist")
     
  };

  updateProduct = async (
    id,
    { description, title, price, thumbnail, code, stock }
  ) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((prod) => prod.id === id);

    if (index != -1) {
      products[index].description = description;
      products[index].title = title;
      products[index].price = price;
      products[index].thumbnail = thumbnail;
      products[index].code = code;
      products[index].stock = stock;
      await fs.writeFile(this.path, JSON.stringify(products));
      console.log("Product edited:");
      console.log(products[index]);
    } else {
      console.log("ERROR: The product with id " + id + " does not exist");
    }
  };

  deleteProduct = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prodByID = products.filter((prod) => prod.id != id);
    await fs.writeFile(this.path, JSON.stringify(prodByID));
  };
}

// PROCESO DE TESTING

const pm = new ProductManager("./products.txt");


console.log("Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []");
await pm.getProducts();

console.log("Llamamos al metodo addProduct");
await pm.addProduct({
  description: "Este es un producto prueba",
  title: "producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
  chocolate: 12,
});

console.log("Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado vez el metodo getProducts, esta vez debe aparecer el producto recién agregado");
await pm.getProducts();


console.log("Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.");
await pm.getProductsByID(100);
await pm.getProductsByID(1);

console.log("Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización")

await pm.updateProduct(1, {
  description: "80% cacao",
  title: "Chocolate amargo",
  price: 15,
  thumbnail: "Sin imagen",
  code: "asd123",
  stock: 200,
});

console.log("Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.")
await pm.deleteProduct(1);
await pm.getProductsByID(1);
await pm.getProducts();