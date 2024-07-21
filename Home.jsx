import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: null,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/forms");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { name, email, mobile, designation, gender, course, image } =
      formData;

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      errors.email = "Invalid email format";
    else if (
      users.some((user) => user.email === email && user.id !== formData.id)
    )
      errors.email = "Email already exists";
    if (!mobile) errors.mobile = "Mobile number is required";
    else if (!/^\d+$/.test(mobile))
      errors.mobile = "Mobile number must be numeric";
    if (!designation) errors.designation = "Designation is required";
    if (!gender) errors.gender = "Gender is required";
    if (!course) errors.course = "Course is required";
    if (image && !["image/jpeg", "application/pdf"].includes(image.type))
      errors.image = "Only JPG and PDF files are allowed";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = {
      ...formData,
      id: editingUser ? formData.id : undefined,
    };

    const formDataToSend = new FormData();
    for (const key in newUser) {
      formDataToSend.append(key, newUser[key]);
    }

    try {
      if (editingUser) {
        await axios.put(`/api/form/${newUser.id}`, formDataToSend);
      } else {
        await axios.post("/api/form", formDataToSend);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      mobile: "",
      designation: "",
      gender: "",
      course: "",
      image: null,
    });
    setValidationErrors({});
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/form/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {validationErrors.name && (
            <p className="error">{validationErrors.name}</p>
          )}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {validationErrors.email && (
            <p className="error">{validationErrors.email}</p>
          )}
        </div>
        <div>
          <label>Mobile No.</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          {validationErrors.mobile && (
            <p className="error">{validationErrors.mobile}</p>
          )}
        </div>
        <div>
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
          {validationErrors.designation && (
            <p className="error">{validationErrors.designation}</p>
          )}
        </div>
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {validationErrors.gender && (
            <p className="error">{validationErrors.gender}</p>
          )}
        </div>
        <div>
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
          {validationErrors.course && (
            <p className="error">{validationErrors.course}</p>
          )}
        </div>
        <div>
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} />
          {validationErrors.image && (
            <p className="error">{validationErrors.image}</p>
          )}
        </div>
        <button type="submit">{editingUser ? "Update" : "Submit"}</button>
      </form>

      <h3>Users List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Mobile: {user.mobile}</p>
            <p>Designation: {user.designation}</p>
            <p>Gender: {user.gender}</p>
            <p>Course: {user.course}</p>
            {user.image && (
              <img src={user.image} alt="User" style={{ width: "100px" }} />
            )}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
