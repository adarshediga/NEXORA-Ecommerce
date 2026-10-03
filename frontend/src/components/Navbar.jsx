import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light-theme");
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = async (value) => {
    setInput(value);
    if (!value.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setShowSearchResults(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(value)}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
      setNoResults(true);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark-theme" ? "light-theme" : "dark-theme");
  };

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container-fluid px-3 px-lg-4">
        <a className="navbar-brand brand-mark" href="/">
          <span className="brand-icon"><i className="bi bi-bag-heart-fill" /></span>
          NEXORA
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/add_product">Add Product</a></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown">Categories</a>
              <ul className="dropdown-menu">
                {categories.map((category) => (
                  <li key={category}>
                    <button className="dropdown-item" onClick={() => onSelectCategory(category)}>{category}</button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center flex-wrap gap-2">
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={`bi ${theme === "dark-theme" ? "bi-sun-fill" : "bi-moon-fill"}`} />
            </button>
            <a href="/cart" className="nav-cart">
              <i className="bi bi-bag-check-fill" /> Cart
            </a>
            <div className="nav-search-wrap">
              <i className="bi bi-search search-icon" />
              <input
                className="form-control nav-search"
                type="search"
                placeholder="Search products..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 180)}
                onFocus={() => input && setShowSearchResults(true)}
              />
              {showSearchResults && (
                <ul className="search-results">
                  {searchResults.length > 0 ? searchResults.map((result) => (
                    <li key={result.id}>
                      <a href={`/product/${result.id}`}>{result.name}</a>
                    </li>
                  )) : noResults && <li className="px-3 py-2 text-secondary">No products found</li>}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
