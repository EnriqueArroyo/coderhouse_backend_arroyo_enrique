class ProductManager {
    constructor() {
        this.products = [];
        this.idCounter = 1;
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        //Chequeo que no falte ningun campo
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Missed adding a field');
            return;
        }

        //Me fijo si el ID esta repetido
        if (this.products.some(product => product.code === code)) {
            console.error('The product with this code already exists');
            return;
        }

       
        this.products.push({ id: this.idCounter++, title, description, price, thumbnail, code, stock });
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.error('Not Found');
            return;
        }
        return product;
    }
}
// PROCESO DE TESTING
const pm = new ProductManager();
console.log("Se creará una instancia de la clase “ProductManager”");
console.log(pm);


console.log("Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []");
console.log(pm.getProducts()); // 

console.log("Se llamará al método “addProduct”");

pm.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
});

console.log("El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE");
console.log("Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado");
console.log(pm.getProducts()); 

console.log("Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.");

pm.addProduct({  //Añado el producto repetido, debe arrojar un error
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
});

console.log("Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo");
console.log(pm.getProductById(100)); // Debe imprimir 'Not Found'
console.log(pm.getProductById(1)); // Debe imprimir el producto
