import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import booksData from "../data/books";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        await delay(500);
        const found = booksData.find(b => b.id === parseInt(id));
        setBook(found || null);
      } catch (error) {
        console.error("Failed to load book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <Loader />;
  if (!book) return <div className="container mt-5"><h3>Book not found!</h3></div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <img src={book.coverImage} className="img-fluid" alt={book.title} />
        </div>
        <div className="col-md-8">
          <h2>{book.title}</h2>
          <h5>by {book.author}</h5>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Year:</strong> {book.publishedYear}</p>
          <p><strong>Pages:</strong> {book.pages}</p>
          <p><strong>Rating:</strong> {book.rating}</p>
          <p>{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
