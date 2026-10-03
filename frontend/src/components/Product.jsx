import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        const image = await axios.get(`/product/${id}/image`, { responseType: "blob" });
        setImageUrl(URL.createObjectURL(image.data));
      } catch (error) { console.error("Error fetching product:", error); }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      await refreshData();
      alert("Product deleted successfully");
      navigate("/");
    } catch (error) { console.error("Error deleting product:", error); }
  };

  if (!product) return <main className="page-shell loading-state">Loading product...</main>;

  return (
    <main className="page-shell">
      <section className="product-detail">
        <div className="detail-image-panel">
          <img className="detail-image" src={imageUrl} alt={product.name} />
        </div>
        <div className="detail-panel">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-brand">{product.brand}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">₹{product.price}</div>
          <div className="detail-meta">
            <span><i className="bi bi-box-seam me-2" />{product.stockQuantity} available</span>
            <span className="ms-3"><i className="bi bi-calendar3 me-2" />{new Date(product.releaseDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-actions">
            <button className="primary-btn px-4" disabled={!product.productAvailable} onClick={() => { addToCart(product); alert("Product added to cart"); }}>
              <i className="bi bi-bag-plus me-2" />{product.productAvailable ? "Add to cart" : "Out of stock"}
            </button>
            <button className="secondary-btn" onClick={() => navigate(`/product/update/${id}`)}><i className="bi bi-pencil me-2" />Update</button>
            <button className="danger-btn" onClick={deleteProduct}><i className="bi bi-trash3 me-2" />Delete</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Product;
