import type { Request, Response } from 'express';
import { pool } from "../conf/dbConnection.ts";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  brand: string;
  img: string;
};

export class ProductController {
    constructor() {}

    public async getAllProducts(_req: Request, res: Response) {
        try {
            const [products] = await pool.execute('SELECT id, name, price, stock, description, brand, img FROM products WHERE active = TRUE')
            
            res.json(products);
        }catch(err){
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public async getProductById(req: Request, res: Response) {
        try {
            const id = Number(req.params['id']);

            if(!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({message: 'Invalid ID'});
            }

            const [result] = await pool.execute('SELECT id, name, price, stock, description, brand, img FROM products WHERE ID = ? AND active = TRUE', [id],);

            const product = result as Product[];

            if(!product[0]) {
                return res.status(404).json({message: 'Product not found'});
            }

            res.json(product[0]);
        }catch(err){
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public async createProduct(req: Request, res: Response) {
        try {
            const { name, price, stock, description, brand, img } = req.body;

            if(!price || typeof price !== 'number' || price <= 0) {
                return res.status(400).json({message: 'Invalid format for price'})
            }

            await pool.execute(`INSERT INTO products (name, price, stock, description, brand, img, active) VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, price, stock, description, brand, img, true]);

            res.status(201).json({message: "Product created"});
        }catch(err){
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public async updateProduct(req: Request, res: Response) {
        try {
            const id = Number(req.params['id']);
            const { name, price, stock, description, brand, img } = req.body;

            if(!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({message: 'Invalid ID'});
            }

            if(!price || typeof price !== 'number' || price <= 0) {
                return res.status(400).json({message: 'Invalid format for price'})
            }

            const [result] = await pool.execute('SELECT id FROM products WHERE ID = ? AND active = TRUE', [id]);

            const product = result as Product[];

            if(!product[0]) {
                return res.status(404).json({message: 'Product not found'});
            }

            await pool.execute(`UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ?`, [name, price, stock, description, brand, img, id]);

            res.status(200).json({message: 'Product updated'});
        }catch(err){
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public async deleteProduct(req: Request, res: Response) {
        try {
            const id = Number(req.params['id']);

            if(!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({message: 'Invalid ID'});
            }

            const [result] = await pool.execute('SELECT id FROM products WHERE id = ? AND active = TRUE', [id]);

            const product = result as Product[];

            if(!product[0]) {
                return res.status(404).json({message: 'Product not found'});
            }
            
            await pool.execute(`UPDATE products SET active = ? WHERE id = ?`, [false, id]);

            res.json('Product deleted');
        }catch(err){
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public async changePriceProduct(req: Request, res: Response) {
        try {
            const id = Number(req.params['id']);
            const { price } = req.body;

            if(!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({message: 'Invalid ID'});
            }

            if(!price || typeof price !== 'number' || price <= 0) {
                return res.status(400).json({message: 'Invalid format for price'})
            }

            const [result] = await pool.execute('SELECT id FROM products WHERE id = ? AND active = TRUE', [id]);

            const product = result as Product[];

            if(!product[0]) {
                return res.status(404).json({message: 'Product not found'});
            }

            await pool.execute(`UPDATE products SET price = ? WHERE id = ?`, [price, id]);

            res.status(200).json({message: 'Price product updated.'})
        }catch(err){
            res.status(500).json({message: 'Internal server error'});
        }
    }
}