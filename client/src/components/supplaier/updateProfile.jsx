import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { CiSettings } from "react-icons/ci";

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
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

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
    setIsLoading(true); // Set loading to true before request

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
        title: "Success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false); // Set loading back to false after request
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
          <Form.Control
            type="password"
            placeholder="Masukan Password Lama"
            value={oldpassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formNewPassword">
          <Form.Label>New Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Masukan Password Baru"
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
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
