import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!cart.length) { setCartItems([]); return; }
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const ids = response.data.map((p) => p.id);
        const valid = cart.filter((item) => ids.includes(item.id));
        const items = await Promise.all(valid.map(async (item) => {
          try {
            const image = await axios.get(`http://localhost:8080/api/product/${item.id}/image`, { responseType: "blob" });
            setCartImage(new File([image.data], item.imageName || "product-image", { type: image.data.type }));
            return { ...item, imageUrl: URL.createObjectURL(image.data) };
          } catch { return item; }
        }));
        setCartItems(items);
      } catch (error) { console.error(error); }
    };
    load();
  }, [cart]);

  useEffect(() => setTotalPrice(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)), [cartItems]);

  const changeQuantity = (id, delta) => {
    setCartItems((items) => items.map((item) => {
      if (item.id !== id) return item;
      const next = Math.max(1, item.quantity + delta);
      if (delta > 0 && next > item.stockQuantity) { alert("Cannot add more than available stock"); return item; }
      return { ...item, quantity: next };
    }));
  };

  const handleRemove = (id) => { removeFromCart(id); setCartItems((items) => items.filter((item) => item.id !== id)); };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updated = { ...rest, stockQuantity: item.stockQuantity - item.quantity };
        const form = new FormData();
        if (cartImage) form.append("imageFile", cartImage);
        form.append("product", new Blob([JSON.stringify(updated)], { type: "application/json" }));
        await axios.put(`http://localhost:8080/api/product/${item.id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      }
      clearCart(); setCartItems([]); setShowModal(false);
    } catch (error) { console.error("error during checkout", error); }
  };

  return (
    <main className="page-shell">
      <div className="cart-page">
        <div className="cart-card">
          <div className="cart-header"><div><h2>Your bag</h2><span className="text-secondary">{cartItems.length} item{cartItems.length === 1 ? "" : "s"}</span></div><i className="bi bi-bag-heart fs-3 text-primary" /></div>
          {!cartItems.length ? <div className="empty-state"><i className="bi bi-bag-x fs-1 d-block mb-3" /><h4>Your bag is empty</h4><p>Add a product to get started.</p><a href="/" className="primary-btn d-inline-block mt-2">Browse products</a></div> : <>
            {cartItems.map((item) => <div className="cart-row" key={item.id}>
              <img src={item.imageUrl} alt={item.name} className="cart-image" />
              <div className="cart-info"><strong>{item.name}</strong><span>{item.brand}</span></div>
              <div className="qty-control"><button className="qty-btn" onClick={() => changeQuantity(item.id, -1)}>-</button><span className="qty-value">{item.quantity}</span><button className="qty-btn" onClick={() => changeQuantity(item.id, 1)}>+</button></div>
              <div className="cart-line-total">₹{item.price * item.quantity}</div>
              <button className="remove-btn" onClick={() => handleRemove(item.id)}><i className="bi bi-trash3" /></button>
            </div>)}
            <div className="cart-footer"><div className="cart-total">Total: ₹{totalPrice}</div><button className="primary-btn px-4" onClick={() => setShowModal(true)}>Checkout</button></div>
          </>}
        </div>
      </div>
      <CheckoutPopup show={showModal} handleClose={() => setShowModal(false)} cartItems={cartItems} totalPrice={totalPrice} handleCheckout={handleCheckout} />
    </main>
  );
};
export default Cart;
