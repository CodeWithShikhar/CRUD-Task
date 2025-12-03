 Route                      Method        What it does           
 `/api/auth/signup`         POST          Register user          
 `/api/auth/login`          POST          Login user  

 `/api/products`            POST          Create product        
 `/api/products`            GET           Get all products       
 `/api/products/:id`        PUT           Update product        
 `/api/products/:id`        DELETE        Delete product   

 `/api/categories`          POST          Create category       
 `/api/categories`          GET           Get all categories     


# User Signup (`POST - /api/auth/signup`)
Accepts name, email, password
Validates input
Hashes password
Stores user in DB
Returns JWT token

# User Login (`POST - /api/auth/login`)
Accepts email and password
Validates input
Verifies password
Returns JWT token

# Authentication Middleware
Reads token from `Authorization: Bearer <token>`
Verifies token
Attaches decoded user to `req.user`

# Category Creation (`POST - /api/categories`)
Requires JWT token
Creates a new category only if it does t already exist

# Get Categories (`GET - /api/categories`)
Returns all categories

# Create Product (`POST - /api/products`)
Requires JWT token
Validates category and price
Prevents duplicates inside the same category
Links product to category

# Update Product (`PUT - /api/products/:id`)
Requires JWT token
Allows updating name, price, and category
Ensures relational sync when category is changed

# Delete Product (`DELETE - /api/products/:id`)
Requires JWT token
Deletes the product and removes its reference from the related category



# Data Model Overview
Category {
  name: String,
  products: [Product._id]
}

Product {
  name: String,
  price: Number,
  category: Category._id,
  createdBy: User._id
}
