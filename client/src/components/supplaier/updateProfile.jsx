import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { CiSettings } from "react-icons/ci";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const iconSize = "25px";
const headerFontSize = "24px";

function UpdateProfile() {
  const [name, setName] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data;
      setName(data.user.name);
      setJabatan(data.user.jabatan);
      setLokasi(data.user.lokasi);
      setPreviewImage(data.user.imageUrl);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("oldpassword", oldpassword);
      formData.append("newpassword", newpassword);
      formData.append("jabatan", jabatan);
      formData.append("lokasi", lokasi);
      formData.append("image", image);

      await axios.put("http://localhost:5000/api/v1/auth/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setOldPassword("");
      setNewPassword("");
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Profil berhasil diperbarui!",
      });
    } catch (error) {
      console.error("Error:", error.message);

      let errorMessage = "Gagal memperbarui profil. Silakan coba lagi.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.data.message === "Incorrect old password") {
          errorMessage = "Kata sandi lama yang Anda masukkan salah.";
        } else {
          errorMessage = error.response.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h1
        style={{ color: "black", marginBottom: "0", fontSize: headerFontSize }}
      >
        <CiSettings style={{ fontSize: iconSize }} /> Profile
      </h1>
      <hr style={{ color: "black" }} />

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: "200px",
              height: "200px",
              marginTop: "10px",
              borderRadius: "50%",
            }}
          />
        )}
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukan Nama Petugas"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formOldPassword">
          <Form.Label>Old Password:</Form.Label>
          <InputGroup>
            <Form.Control
              type={showOldPassword ? "text" : "password"}
              placeholder="Masukan Password Lama"
              value={oldpassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <InputGroup.Text
              onClick={() => setShowOldPassword(!showOldPassword)}
              style={{ cursor: "pointer" }}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formNewPassword">
          <Form.Label>New Password:</Form.Label>
          <InputGroup>
            <Form.Control
              type={showNewPassword ? "text" : "password"}
              placeholder="Masukan Password Baru"
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputGroup.Text
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{ cursor: "pointer" }}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Profile Image:</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Button variant="primary mt-5" type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </Button>
      </Form>
    </div>
  );
}

export default UpdateProfile;
