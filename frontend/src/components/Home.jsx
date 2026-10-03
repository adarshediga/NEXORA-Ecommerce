import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  useEffect(() => { refreshData(); }, [refreshData]);

  useEffect(() => {
    if (!data?.length) { setProducts([]); return; }
    const fetchImages = async () => {
      const updated = await Promise.all(data.map(async (product) => {
        try {
          const response = await axios.get(`http://localhost:8080/api/product/${product.id}/image`, { responseType: "blob" });
          return { ...product, imageUrl: URL.createObjectURL(response.data) };
        } catch {
          return { ...product, imageUrl: unplugged };
        }
      }));
      setProducts(updated);
    };
    fetchImages();
  }, [data]);

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products;

  if (isError) return <div className="error-state"><img src={unplugged} alt="Connection error" width="100" /></div>;

  return (
    <main className="page-shell">
      <section className="hero">
        <span className="hero-badge"><i className="bi bi-stars me-2" /> Curated for everyday life</span>
        <h1>Find something you'll love.</h1>
        <p>Explore quality products, discover new favourites, and add them to your bag in a few clicks.</p>
        <a href="#products" className="btn btn-light rounded-pill px-4 fw-bold">Explore products <i className="bi bi-arrow-right ms-2" /></a>
      </section>

      <div className="section-head" id="products">
        <div>
          <h2>{selectedCategory || "Featured products"}</h2>
          <p>{filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} available</p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state"><i className="bi bi-box-seam fs-1 d-block mb-3" />No products available.</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="shop-card" key={product.id}>
              <Link to={`/product/${product.id}`}>
                <div className="product-image-wrap">
                  <span className={`stock-badge ${product.productAvailable ? "" : "out"}`}>
                    {product.productAvailable ? "In stock" : "Out of stock"}
                  </span>
                  <img className="product-image" src={product.imageUrl} alt={product.name} />
                </div>
              </Link>
              <div className="shop-card-body">
                <div className="product-brand">{product.brand}</div>
                <Link to={`/product/${product.id}`}><h3 className="product-name">{product.name}</h3></Link>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="product-price">₹{product.price}</div>
                  <button className="primary-btn" onClick={() => addToCart(product)} disabled={!product.productAvailable}>
                    <i className="bi bi-plus-lg me-1" /> Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
