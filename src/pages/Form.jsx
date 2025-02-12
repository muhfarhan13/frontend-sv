import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Form = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari parameter URL untuk mode edit

  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    status: "draft", // Default status: draft
  });

  // State untuk validasi error
  const [errors, setErrors] = useState({});

  // Fetch data jika dalam mode edit
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/article/${id}`)
        .then((response) => response.json())
        .then((article) => {
          setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            status: article.status || "draft",
          });
        })
        .catch((error) =>
          console.error("Gagal mengambil data Data:", error)
        );
    }
  }, [id]);

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi validasi sebelum submit
  const validate = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul wajib diisi";
    } else if (formData.title.length < 20) {
      newErrors.title = "Judul minimal 20 karakter";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Konten wajib diisi";
    } else if (formData.content.length < 200) {
      newErrors.content = "Konten minimal 200 karakter";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Kategori wajib diisi";
    } else if (formData.category.length < 3) {
      newErrors.category = "Kategori minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit form
  const handleSubmit = (publishStatus) => {
    if (!validate()) return;

    const articleData = { ...formData, status: publishStatus };

    const requestOptions = {
      method: id ? "PUT" : "POST", // PUT untuk edit, POST untuk tambah
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleData),
    };

    const endpoint = id
      ? `http://localhost:8080/article/${id}` // Edit data (PUT)
      : "http://localhost:8080/article"; // Tambah data (POST)

    fetch(endpoint, requestOptions)
      .then((response) =>
        response.json().then((data) => ({ status: response.ok, data }))
      )
      .then(({ status, data }) => {
        if (status) {
          Swal.fire({
            title: "Berhasil!",
            text: id
              ? "Data berhasil diperbarui!"
              : "Data berhasil ditambahkan!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => navigate("/"));
        } else {
          throw new Error(data?.message || "Gagal menyimpan data.");
        }
      })
      .catch((error) => Swal.fire("Error!", error.message, "error"));
  };

  return (
    <div>
      <h2>{id ? "Edit Data" : "Tambah Data Baru"}</h2>
      <form style={formStyle}>
        <input
          type="text"
          name="title"
          placeholder="Judul (Minimal 20 karakter)"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {errors.title && <p style={errorStyle}>{errors.title}</p>}

        <textarea
          name="content"
          placeholder="Konten (Minimal 200 karakter)"
          value={formData.content}
          onChange={handleChange}
          required
          style={textareaStyle}
        />
        {errors.content && <p style={errorStyle}>{errors.content}</p>}

        <input
          type="text"
          name="category"
          placeholder="Kategori (Minimal 3 karakter)"
          value={formData.category}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        {errors.category && <p style={errorStyle}>{errors.category}</p>}

        <div style={buttonContainerStyle}>
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            style={draftButtonStyle}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("publish")}
            style={publishButtonStyle}
          >
            Publish
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={cancelButtonStyle}
        >
          Batal
        </button>
      </form>
    </div>
  );
};

// Styling
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  backgroundColor: "#222",
  padding: "15px",
  borderRadius: "5px",
  width: "350px",
  color: "white",
};
const inputStyle = {
  padding: "8px",
  borderRadius: "3px",
  border: "1px solid #444",
  backgroundColor: "#333",
  color: "white",
};
const textareaStyle = { ...inputStyle, height: "120px" };
const buttonContainerStyle = { display: "flex", gap: "10px" };
const draftButtonStyle = {
  padding: "8px",
  backgroundColor: "gray",
  color: "white",
  borderRadius: "3px",
  cursor: "pointer",
  width: "100%",
};
const publishButtonStyle = {
  padding: "8px",
  backgroundColor: "blue",
  color: "white",
  borderRadius: "3px",
  cursor: "pointer",
  width: "100%",
};
const cancelButtonStyle = { ...draftButtonStyle, backgroundColor: "red" };
const errorStyle = { color: "red", fontSize: "12px", marginTop: "-8px" };

export default Form;
