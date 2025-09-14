import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="container text-center mt-5">
    <h1>Welcome to the Book Library</h1>
    <p>Explore our collection of amazing books, discover new favorites, and enjoy reading!</p>
    <Link to="/books" className="btn btn-primary mt-3">View Books</Link>
  </div>
);

export default Home;
