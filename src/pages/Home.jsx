import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all"); // State untuk filter tab
  const navigate = useNavigate();

  // Ambil data dari backend
  useEffect(() => {
    fetch("http://localhost:8080/article")
      .then((response) => response.json())
      .then((value) => setData(value))
      .catch((error) => console.error("Gagal mengambil data:", error));
  }, []);

  // Fungsi untuk menghapus data
  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/article/${id}`, { method: "DELETE" })
          .then((response) => {
            if (response.ok) {
              setData(data.filter((item) => item.id !== id));
              Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
            } else {
              Swal.fire("Gagal!", "Data gagal dihapus.", "error");
            }
          })
          .catch(() => Swal.fire("Kesalahan!", "Terjadi kesalahan.", "error"));
      }
    });
  };

  // Filter data sesuai tab yang dipilih
  const filteredData =
    filter === "all" ? data : data.filter((item) => item.status === filter);

  return (
    <div>
      <h1>Semua Data</h1>
      <div style={nav}>
        {/* Tabs Filter */}
        <div style={tabContainerStyle}>
          <button
            onClick={() => setFilter("all")}
            style={filter === "all" ? activeTabStyle : tabStyle}
          >
            All
          </button>
          <button
            onClick={() => setFilter("publish")}
            style={filter === "publish" ? activeTabStyle : tabStyle}
          >
            Publish
          </button>
          <button
            onClick={() => setFilter("draft")}
            style={filter === "draft" ? activeTabStyle : tabStyle}
          >
            Draft
          </button>
        </div>
        <div className="btnAdd">
          <Link to="/form" style={buttonStyle}>
            + Tambah Baru
          </Link>
        </div>
      </div>

      {/* Table Data */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.status === "publish" ? "Publish" : "Draft"}</td>
              <td>
                <button
                  onClick={() => navigate(`/form/${item.id}`)}
                  style={editButtonStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={deleteButtonStyle}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styling
const nav = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#222",
  color: "white",
};

const buttonStyle = {
  padding: "8px",
  backgroundColor: "blue",
  color: "white",
  textDecoration: "none",
};

const editButtonStyle = {
  marginRight: "5px",
  padding: "5px",
  backgroundColor: "orange",
  color: "white",
};

const deleteButtonStyle = {
  padding: "5px",
  backgroundColor: "red",
  color: "white",
};

const tabContainerStyle = {
  display: "flex",
  gap: "10px",
  margin: "10px 0",
};

const tabStyle = {
  padding: "10px 15px",
  backgroundColor: "#333",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: "blue",
};

export default Home;
