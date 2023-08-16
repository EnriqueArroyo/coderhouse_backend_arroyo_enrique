import { promises as fs } from 'fs';

export class ProductManager {
	constructor(path) {
		this.products = [];
		this.path = path;
	}



	async addProduct(product) {
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		const { title, description, price, code, stock, status } = product;

		// verifico si me falta algúN dato
		if (!title || !description || !price || !status || !code || !stock) {
			console.log(
				'Todos los campos deben estar completos'
			);
			return;
		}

		// verifico el code
		const prodExists = this.products.find(element => element.code === code);
		if (prodExists) {
			return false;
		} else {
			product.id = ProductManager.incrementId(this.products);
			product.status = true;
			this.products.push(product);
		}


		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	async getProducts() { // obtener productos
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products;
	}

	async getProductById(id) { //obtener producto por id
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		return this.products.find(product => product.id == id) ?? false;
	}

	async updateProducts(id, update) { //actualizar productos
		this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		let product = this.products.find(prod => prod.id == id);
		if (!product) {
			return false;
		}

		let keys = Object.keys(update);
		keys.map(key => key !== 'id' && (product[key] = update[key]));
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	async deleteProduct(id) { //borrar producto
		const fileProducts = JSON.parse(await fs.readFile(this.path, 'utf-8'));
		this.products = fileProducts.filter(prod => prod.id !== id);
		if (this.products.length === fileProducts.length) {
			return false;
		}
		let writeProducts = JSON.stringify(this.products);
		await fs.writeFile(this.path, writeProducts);
		return true;
	}

	static incrementId(products) { //recorro los IDs, verifico si hay y retorno el nuevo valor
		const ids = products.map(product => product.id);
		let newId = 1;
		products.length > 0 && (newId = Math.max(...ids) + 1);
		return newId;
	}
}



