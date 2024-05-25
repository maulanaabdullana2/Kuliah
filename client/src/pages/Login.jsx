import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { username, password },
      );
      const { accessToken } = response.data.data;
      localStorage.setItem("token", accessToken);

      const decodedToken = jwtDecode(accessToken);
      const userRole = decodedToken.role;

      if (userRole === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/users");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username atau Password Anda Salah",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div
        className="login-form p-4 rounded shadow-lg"
        style={{ maxWidth: "800px" }}
      >
        <h2 className="mb-4 text-center">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukan Username"
              size="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Masukan Password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </Button>
            </div>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
