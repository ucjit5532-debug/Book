import { useState } from "react";
import { Button, TextInput, Textarea } from "flowbite-react";

const UploadBooks = () => {
  const [formData, setFormData] = useState({
    bookTitle: "",
    authorName: "",
    imageURL: "",
    category: "",
    bookDescription: "",
    bookPDFURL: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  // Handle input and dropdown changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFeedback({ type: "", message: "" });
  };

  // Submit book details to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch(
        "http://localhost:3000/Upload-book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Book upload failed."
        );
      }

      setFeedback({
        type: "success",
        message:
          result.message || "Book uploaded successfully!",
      });

      // Clear the form after successful upload
      setFormData({
        bookTitle: "",
        authorName: "",
        imageURL: "",
        category: "",
        bookDescription: "",
        bookPDFURL: "",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof TypeError
            ? "Could not reach the book server. Make sure the backend is running on port 3000 and try again."
            : error instanceof Error
              ? error.message
              : "Book upload failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-8 lg:px-12">
      {/* Form Container */}
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        {/* Form Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Upload A book
          </h1>
        </div>

        {/* Book Form */}
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          {/* Top Grid: 2 columns on medium screens */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Book Title */}
            <div>
              <label
                htmlFor="bookTitle"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Book Title
              </label>
              <TextInput
                id="bookTitle"
                name="bookTitle"
                type="text"
                placeholder="Book 1"
                value={formData.bookTitle}
                onChange={handleChange}
                required
              />
            </div>

            {/* Author Name */}
            <div>
              <label
                htmlFor="authorName"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Author Name
              </label>
              <TextInput
                id="authorName"
                name="authorName"
                type="text"
                placeholder="Author Name"
                value={formData.authorName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Book Image URL */}
            <div>
              <label
                htmlFor="imageURL"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Book Image URL
              </label>
              <TextInput
                id="imageURL"
                name="imageURL"
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                value={formData.imageURL}
                onChange={handleChange}
                required
              />
            </div>

            {/* Book Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Book Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="" disabled>
                  Select a book category
                </option>
                <option value="Fiction">Fiction</option>
                <option value="Non-fiction">Non-fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Programming">Programming</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
                <option value="Autobiography">Autobiography</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Horror">Horror</option>
                <option value="Memoir">Memoir</option>
                <option value="Business">Business</option>
                <option value="Children">Children</option>
                <option value="Travel">Travel</option>
                <option value="Religion">Religion</option>
                <option value="Art and Design">Art and Design</option>
              </select>
            </div>
          </div>

          {/* Book Description */}
          <div>
            <label
              htmlFor="bookDescription"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Book Description
            </label>
            <Textarea
              id="bookDescription"
              name="bookDescription"
              placeholder="Write your book description..."
              required
              rows={4}
              value={formData.bookDescription}
              onChange={handleChange}
            />
          </div>

          {/* Book PDF URL */}
          <div>
            <label
              htmlFor="bookPDFURL"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Book PDF URL
            </label>
            <TextInput
              id="bookPDFURL"
              name="bookPDFURL"
              type="url"
              placeholder="book pdf url"
              value={formData.bookPDFURL}
              onChange={handleChange}
              required
            />
          </div>

          {/* Feedback Message */}
          {feedback.message && (
            <p
              role="status"
              className={`w-full rounded-lg border px-4 py-3 text-sm font-medium ${
                feedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {feedback.message}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full bg-teal-800 hover:bg-teal-900"
          >
            {isSubmitting ? "Uploading..." : "Upload Book"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadBooks;