import { Modal } from "react-bootstrap";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton><Modal.Title>Review your order</Modal.Title></Modal.Header>
    <Modal.Body>
      {cartItems.map((item) => (
        <div key={item.id} className="d-flex align-items-center gap-3 mb-3">
          <img src={item.imageUrl} alt={item.name} style={{ width: 70, height: 65, objectFit: "contain", borderRadius: 10, background: "#f1f5f9" }} />
          <div><strong>{item.name}</strong><div className="text-secondary small">Qty: {item.quantity}</div><div className="fw-bold">₹{item.price * item.quantity}</div></div>
        </div>
      ))}
      <hr /><div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{totalPrice}</span></div>
    </Modal.Body>
    <Modal.Footer><button className="secondary-btn" onClick={handleClose}>Close</button><button className="primary-btn" onClick={handleCheckout}>Confirm purchase</button></Modal.Footer>
  </Modal>
);
export default CheckoutPopup;
