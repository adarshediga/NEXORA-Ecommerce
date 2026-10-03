import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", brand: "", description: "", price: "", category: "", stockQuantity: "", releaseDate: "", productAvailable: false });
  const [image, setImage] = useState(null);
  const handleInputChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });
  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    axios.post("http://localhost:8080/api/product", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => alert("Product added successfully"))
      .catch((error) => { console.error(error); alert("Error adding product"); });
  };
  return (
    <main className="page-shell">
      <div className="form-page">
        <div className="form-card">
          <div className="mb-4"><div className="form-title">Add a new product</div><div className="form-subtitle">Add product information and an image to your catalogue.</div></div>
          <form className="row g-4" onSubmit={submitHandler}>
            <div className="col-md-6"><label className="form-label">Name</label><input type="text" className="form-control" placeholder="Product name" onChange={handleInputChange} value={product.name} name="name" required /></div>
            <div className="col-md-6"><label className="form-label">Brand</label><input type="text" name="brand" className="form-control" placeholder="Brand" value={product.brand} onChange={handleInputChange} required /></div>
            <div className="col-12"><label className="form-label">Description</label><input type="text" className="form-control" placeholder="Short product description" value={product.description} name="description" onChange={handleInputChange} required /></div>
            <div className="col-md-5"><label className="form-label">Price</label><input type="number" className="form-control" placeholder="0" onChange={handleInputChange} value={product.price} name="price" required /></div>
            <div className="col-md-7"><label className="form-label">Category</label><select className="form-select" value={product.category} onChange={handleInputChange} name="category" required><option value="">Select category</option><option>Laptop</option><option>Headphone</option><option>Mobile</option><option>Electronics</option><option>Toys</option><option>Fashion</option></select></div>
            <div className="col-md-4"><label className="form-label">Stock quantity</label><input type="number" className="form-control" placeholder="Available stock" onChange={handleInputChange} value={product.stockQuantity} name="stockQuantity" required /></div>
            <div className="col-md-4"><label className="form-label">Release date</label><input type="date" className="form-control" value={product.releaseDate} name="releaseDate" onChange={handleInputChange} required /></div>
            <div className="col-md-4"><label className="form-label">Product image</label><input className="form-control" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required /></div>
            <div className="col-12"><div className="form-check"><input className="form-check-input" type="checkbox" name="productAvailable" id="gridCheck" checked={product.productAvailable} onChange={(e) => setProduct({ ...product, productAvailable: e.target.checked })} /><label className="form-check-label" htmlFor="gridCheck">Product is available</label></div></div>
            <div className="col-12"><button type="submit" className="primary-btn px-4">Add product <i className="bi bi-arrow-right ms-2" /></button></div>
          </form>
        </div>
      </div>
    </main>
  );
};
export default AddProduct;
