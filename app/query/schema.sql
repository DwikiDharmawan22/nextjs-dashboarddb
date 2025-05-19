-- schema.sql
-- Membuat tabel untuk customers
CREATE TABLE customers (
  username VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  transactions TEXT[] DEFAULT '{}'
);

-- Mengisi data awal untuk tabel customers
INSERT INTO customers (username, email, phone, transactions) VALUES
  ('Century', 'cent29@gmail.com', '0836181937', ARRAY['2 Topeng Cicilia', '1 Topeng Hudoq', '10 Topeng Jesica']),
  ('Yonoji', 'cent29@gmail.com', '0836181937', ARRAY['2 Topeng Cicilia', '10 Topeng Jesica']),
  ('Sutami', 'cent29@gmail.com', '0836181937', ARRAY['2 Topeng Cicilia', '5 Topeng Hudoq']),
  ('Ohena', 'cent29@gmail.com', '0836181937', ARRAY['2 Topeng Cicilia', '1 Topeng Hudoq', '19 Topeng Jesica']);

-- Membuat tabel untuk transactions
CREATE TABLE transactions (
  id VARCHAR(255) PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  totalPrice NUMERIC NOT NULL,
  username VARCHAR(255) NOT NULL,
  product TEXT NOT NULL
);

-- Mengisi data awal untuk tabel transactions
-- Konversi totalPrice dari string ke numeric (menghapus 'Rp' dan format mata uang)
INSERT INTO transactions (id, date, totalPrice, username, product) VALUES
  ('#J729', '2025-10-08 10:40:45', 1000000, 'Paijo', 'Topeng Cicilia - 2 pcs'),
  ('#K729', '2025-10-08 10:40:45', 1118000, 'Tuyul', 'Topeng Jesica - 3 pcs'),
  ('#L729', '2025-10-08 10:40:45', 600000, 'Kucing', 'Topeng Dwiki - 2 pcs'),
  ('#M729', '2025-10-08 10:40:45', 500000, 'Hujan', 'Topeng Hudoo - 1 pcs');

-- Membuat tabel untuk products
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  image TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL
);

-- Mengisi data awal untuk tabel products
-- Konversi price dari string ke numeric (menghapus 'IDR' dan format)
INSERT INTO products (id, image, name, price) VALUES
  ('#J729', '/topeng cicilia.png', 'Topeng Cicilia', 500000),
  ('#K729', '/topeng jesica.png', 'Topeng Jesica', 370000),
  ('#L729', '/topeng dwiki.png', 'Topeng Dwiki', 300000);

-- Membuat tabel untuk available_products
CREATE TABLE available_products (
  name VARCHAR(255) PRIMARY KEY,
  price NUMERIC NOT NULL
);

-- Mengisi data awal untuk tabel available_products
INSERT INTO available_products (name, price) VALUES
  ('Topeng Cicilia', 500000),
  ('Topeng Jesica', 350000),
  ('Topeng Dwiki', 300000),
  ('Topeng Hudoq', 400000);

-- Membuat tabel untuk daily_income
CREATE TABLE daily_income (
  id SERIAL PRIMARY KEY,
  day DATE NOT NULL,
  amount NUMERIC NOT NULL
);

-- Mengisi data awal untuk tabel daily_income (berdasarkan data di fetchDashboardData)
INSERT INTO daily_income (day, amount) VALUES
  ('2025-05-12', 30000), -- Senin
  ('2025-05-13', 35000), -- Selasa
  ('2025-05-14', 20000), -- Rabu
  ('2025-05-15', 25000), -- Kamis
  ('2025-05-16', 40000); -- Jumat

-- Membuat tabel untuk monthly_income
CREATE TABLE monthly_income (
  id SERIAL PRIMARY KEY,
  month VARCHAR(3) NOT NULL,
  amount NUMERIC NOT NULL
);

-- Mengisi data awal untuk tabel monthly_income (berdasarkan data di fetchDashboardData)
INSERT INTO monthly_income (month, amount) VALUES
  ('Jan', 15000),
  ('Feb', 20000),
  ('Mar', 25000),
  ('Apr', 30000),
  ('Mei', 18000),
  ('Jun', 22000),
  ('Jul', 28000),
  ('Ags', 32000),
  ('Sep', 20000),
  ('Okt', 25000),
  ('Nov', 15000),
  ('Des', 10000);

-- Membuat tabel untuk profile
CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  facebook VARCHAR(255) NOT NULL
);

-- Mengisi data awal untuk tabel profile
INSERT INTO profile (name, role, email, phone, facebook) VALUES
  ('Dwiki Dharmawan', 'Pegawai', 'cicilia175@gmail.com', '083418461937', '@Ciciliaaa');

-- Membuat tabel untuk pelanggan_products
CREATE TABLE pelanggan_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  imageSrc TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  altText TEXT NOT NULL,
  link TEXT NOT NULL
);

-- Mengisi data awal untuk tabel pelanggan_products
INSERT INTO pelanggan_products (name, imageSrc, width, height, altText, link) VALUES
  ('TOPENG DWIKI', '/topeng dwiki.png', 190, 150, 'Topeng Dwiki', '/dashboard/product'),
  ('TOPENG JESICA', '/topeng jesica.png', 150, 150, 'Topeng Jesica', '/dashboard/product/product2'),
  ('TOPENG CICILIA', '/topeng cicilia.png', 167, 150, 'Topeng Cicilia', '/dashboard/product/product3');

-- Membuat tabel untuk team_members
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

-- Mengisi data awal untuk tabel team_members
INSERT INTO team_members (image, name, description) VALUES
  ('/dwiki.png', 'Dwiki Dharmawan', 'Barongsai KW yang menjadi astagfirullah gatau mau nulis apa'),
  ('/Jesica.png', 'Jesica Sihombing', 'China KW gatau juga ini mau ngetik apaan tapi yaudahlah yahh'),
  ('/cicilia.png', 'Cicilia Gadja', 'nama ku gadja yaa bukan gadjah apalagi gajah #krisis identitas');

-- Membuat tabel untuk shop_products
CREATE TABLE shop_products (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  link TEXT NOT NULL
);

-- Mengisi data awal untuk tabel shop_products
INSERT INTO shop_products (image, name, width, height, link) VALUES
  ('/topeng dwiki.png', 'TOPENG DWIKI', 150, 150, '/dashboard/product'),
  ('/topeng jesica.png', 'TOPENG JESICA', 220, 240, '/dashboard/product/product2'),
  ('/topeng cicilia.png', 'TOPENG CICILIA', 220, 240, '/dashboard/product/product3'),
  ('/topeng jesica.png', 'TOPENG CICILIA', 220, 240, '/dashboard/product');

-- Membuat tabel untuk product_details
CREATE TABLE product_details (
  id VARCHAR(255) PRIMARY KEY,
  image TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  materials JSONB NOT NULL,
  price NUMERIC NOT NULL,
  rating NUMERIC NOT NULL,
  navigation JSONB NOT NULL
);

-- Mengisi data awal untuk tabel product_details
-- Konversi price dari string ke numeric (menghapus 'RP' dan format)
INSERT INTO product_details (id, image, name, description, materials, price, rating, navigation) VALUES
  ('product1', '/topeng dwiki.png', 'TOPENG DWIKI', 'THIS IS A MASK THAT COMES FROM THE RIAU ISLANDS.\nWHERE THIS MASK IS A PP TEACHING ASSISTANT, THIS\nMASK CAN ALSO COPE.', 
    '[{"name": "SELECTED MAHOGANY WOOD"}, {"name": "DUMLING PAPER"}, {"name": "HIGHLY PIGMENTED NATURAL PAINT"}]', 
    300000, 4.5, '{"back": "/dashboard/product/product3", "next": "/dashboard/product/product2"}'),
  ('product2', '/topeng jesica.png', 'TOPENG JESICA', 'THIS IS A MASK THAT COMES FROM BATAK, WHERE THIS.\nMASK IS A CHINESE IMITATION, THIS MASK CAN ALSO\nCODE.', 
    '[{"name": "SELECTED MAHOGANY WOOD"}, {"name": "DUMPLING PAPER"}, {"name": "HIGHLY PIGMENTED NATURAL PAINT"}]', 
    370000, 3.5, '{"back": "/dashboard/product2", "next": "/dashboard/product/product3"}'),
  ('product3', '/topeng cicilia.png', 'TOPENG CICILIA', 'THIS IS A MASK THAT COMES FROM JAKARTA, WHERE THIS\nMASK IS EXPERIENCING A BIT OF AN IDENTITY CRISIS,\nTHIS MASK CAN ALSO COPE.', 
    '[{"name": "SELECTED MAHOGANY WOOD"}, {"name": "DUMPLING PAPER"}, {"name": "HIGHLY PIGMENTED NATURAL PAINT"}]', 
    500000, 5, '{"back": "/dashboard/product/product2", "next": "/dashboard/product"}');

-- Membuat tabel untuk review_products
CREATE TABLE review_products (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  rating NUMERIC NOT NULL,
  description TEXT NOT NULL
);

-- Mengisi data awal untuk tabel review_products
INSERT INTO review_products (image, name, width, height, rating, description) VALUES
  ('/topeng dwiki.png', 'TOPENG DWIKI', 130, 130, 4.5, 'Amazing mask shop with\nhigh-quality designs!\nComfortable, durable, and\nperfect for any occasion.'),
  ('/topeng jesica.png', 'TOPENG JESICA', 200, 220, 4.5, 'Amazing mask shop with\nhigh-quality designs!\nComfortable, durable, and\nperfect for any occasion.'),
  ('/topeng cicilia.png', 'TOPENG CICILIA', 200, 220, 4.5, 'Amazing mask shop with\nhigh-quality designs!\nComfortable, durable, and\nperfect for any occasion.');

-- Membuat tabel untuk blog_products
CREATE TABLE blog_products (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  postDate DATE NOT NULL,
  description TEXT NOT NULL
);

-- Mengisi data awal untuk tabel blog_products
INSERT INTO blog_products (image, name, postDate, description) VALUES
  ('/topeng jesica.png', 'Topeng Jesica', '2023-01-05', 'Used in the hudoq dance,\na traditional art of the Dayak tribe.'),
  ('/topeng cicilia.png', 'Topeng Cicilia', '2023-01-05', 'Used in the hudoq dance,\na traditional art of the Dayak tribe.'),
  ('/topeng cicilia.png', 'Topeng Cicilia', '2023-01-05', 'Used in the hudoq dance,\na traditional art of the Dayak tribe.'),
  ('/topeng jesica.png', 'Topeng Jesica', '2023-01-05', 'Used in the hudoq dance,\na traditional art of the Dayak tribe.');