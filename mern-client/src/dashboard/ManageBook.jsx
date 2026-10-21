import { useEffect, useState } from "react";
import { Link } from "react-router";

const ManageBook = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 10000);

    const loadBooks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:3000/all-books", {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load books.");
        }
        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid book list.");
        }

        setBooks(data);
      } catch (err) {
        if (!controller.signal.aborted || timedOut) {
          setError(
            timedOut
              ? "Loading books timed out. Check that the backend and database are running, then retry."
              : err instanceof TypeError
                ? "Could not connect to the books API at http://localhost:3000. Check that the backend is running."
                : err instanceof Error
                  ? err.message
                  : "Failed to load books."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
        clearTimeout(timeoutId);
      }
    };

    loadBooks();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [reloadCount]);

  const handleDelete = async (id) => {
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/book/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book.");
      }

      setBooks((currentBooks) => currentBooks.filter((book) => book._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book.");
    }
  };

  return (
    <div className="my-12 w-full min-w-0 px-4">
      <h2 className="mb-8 text-3xl font-bold">Manage Your Books</h2>

      {error && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            className="mt-3 rounded bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <p role="status" className="text-gray-600">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-4 text-gray-600">
          No books found in the <code>bookInventory.books</code> collection. Check the collection name or add book records to this collection.
        </p>
      ) : (
        <div className="w-full rounded-lg border border-gray-200">
          <table className="w-full table-fixed text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="w-[7%] px-3 py-3">#</th>
                <th scope="col" className="w-[22%] px-3 py-3">Book Name</th>
                <th scope="col" className="w-[18%] px-3 py-3">Author Name</th>
                <th scope="col" className="w-[16%] px-3 py-3">Category</th>
                <th scope="col" className="w-[12%] px-3 py-3">Price</th>
                <th scope="col" className="w-[13%] px-3 py-3">Edit / Manage</th>
                <th scope="col" className="w-[12%] px-3 py-3">Delete</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {books.map((book, index) => (
                <tr
                  key={book._id || index}
                  className="bg-white even:bg-gray-50"
                >
                  <td className="px-3 py-4 font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="break-words px-3 py-4 font-medium text-gray-900">
                    {book.bookTitle || "—"}
                  </td>
                  <td className="break-words px-3 py-4">{book.authorName || "—"}</td>
                  <td className="break-words px-3 py-4">{book.category || "—"}</td>
                  <td className="break-words px-3 py-4">
                    {book.price == null || book.price === "" ? "—" : `$${book.price}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <Link
                      to={`/admin/dashboard/edit-books/${book._id}`}
                      className="font-medium text-cyan-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(book._id)}
                      className="rounded-sm bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBook;