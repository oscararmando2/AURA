# Product Installation Guide

This guide explains how to populate the database with the 318 products from the market's inventory.

## Prerequisites

- MySQL server installed and running
- Database `el_mexiquense_market` created (run `database.sql` first if not done)
- MySQL user with permissions to insert data

## Installation Steps

### Option 1: Using MySQL Command Line

1. Open a terminal or command prompt
2. Navigate to the AURA directory
3. Run the following command:

```bash
mysql -u root -p el_mexiquense_market < insert_products.sql
```

4. Enter your MySQL password when prompted

### Option 2: Using phpMyAdmin

1. Open phpMyAdmin in your web browser
2. Select the `el_mexiquense_market` database
3. Click on the "SQL" tab
4. Copy the contents of `insert_products.sql` and paste it into the SQL query box
5. Click "Go" to execute

### Option 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `insert_products.sql` file (File → Open SQL Script)
4. Click the lightning bolt icon (Execute) to run the script

## Verification

After running the script, verify that the products were inserted correctly:

```sql
USE el_mexiquense_market;
SELECT COUNT(*) as total_products FROM productos;
```

You should see **318 products** in the database.

### Sample Verification Queries

Check some specific products:

```sql
-- Check a product by UPC
SELECT * FROM productos WHERE upc = '070038386599';

-- List first 10 products
SELECT upc, producto, precio FROM productos LIMIT 10;

-- Count products by price range
SELECT 
    CASE 
        WHEN precio < 1 THEN 'Under $1'
        WHEN precio < 5 THEN '$1-$5'
        WHEN precio < 10 THEN '$5-$10'
        ELSE 'Over $10'
    END as price_range,
    COUNT(*) as count
FROM productos 
GROUP BY price_range;
```

## Product List Overview

The script includes 318 unique products covering:

- ✅ Beverages (sodas, juices, milk, energy drinks)
- ✅ Food items (pasta, beans, snacks, condiments)
- ✅ Dairy products (cheese, cream, eggs)
- ✅ Personal care (shampoo, hair gel, soap)
- ✅ Household items (cleaning products, aluminum foil)
- ✅ Fresh produce (vegetables, fruits)
- ✅ Specialty items (tamale masa, tortillas)

## Troubleshooting

### Error: Table 'productos' doesn't exist

**Solution**: Run the `database.sql` script first to create the database schema:

```bash
mysql -u root -p < database.sql
```

### Error: Duplicate entry for key 'upc'

**Solution**: The script includes a DELETE statement to remove existing products. If you want to preserve existing products, remove these lines from `insert_products.sql`:

```sql
-- Delete existing sample products
DELETE FROM productos WHERE id > 0;
```

### Error: Access denied

**Solution**: Make sure your MySQL user has INSERT and DELETE permissions:

```sql
GRANT ALL PRIVILEGES ON el_mexiquense_market.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### Some products are missing

**Solution**: Check for any error messages during import. The script should have inserted exactly 318 products. If some are missing, run the count query to see how many were inserted:

```sql
SELECT COUNT(*) FROM productos;
```

## Using the Products

After installation, you can immediately:

1. **Search by UPC**: Enter a UPC code in the invoice system to automatically fill product details
2. **Browse products**: Query the database to see all available products
3. **Create invoices**: Use the web interface at `factura.php` or `index.html` to create invoices with these products

## Example Usage in Invoice System

1. Open the invoice system in your browser (http://localhost:8080/factura.php)
2. Enter a UPC code like `070038386599` in the UPC field
3. The system will auto-fill:
   - Product: "Best Choice 2.5 Dozen Large"
   - Price: $4.62
4. Enter the quantity and click "Guardar Factura" to generate a PDF invoice

## Support

For issues or questions:
- Check the main [README.md](README.md) for general setup instructions
- Review [FACTURACION_README.md](FACTURACION_README.md) for PHP system details
- Check the MySQL error log for detailed error messages

## Notes

- All prices are in USD
- Default unit is 'PZA' (piece/unit)
- Products with duplicate UPCs are filtered (only first occurrence is kept)
- Products without UPC codes are assigned sequential IDs
- The script preserves UTF-8 encoding for special characters (accents, ñ, etc.)
