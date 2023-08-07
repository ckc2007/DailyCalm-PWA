import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../graphql/mutations";
import { authService } from "../utils/auth";

const SignupForm = ({ handleModalClose }) => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addUser] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const { data } = await addUser({
          variables: {
            username: userFormData.username,
            email: userFormData.email,
            password: userFormData.password,
          },
        });

        const { token } = data.addUser;
        console.log(token);

        authService.login(token);
        handleModalClose();
      } catch (err) {
        console.error(err);
        setShowAlert(true);
      }
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="box">
      {showAlert && (
        <div className="notification is-danger">
          Something went wrong with your signup!
        </div>
      )}
      <form noValidate onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="username">
            Username
          </label>
          <div className="control">
            <input
              className={`input ${validated && !userFormData.username ? "is-danger" : ""}`}
              type="text"
              placeholder="Your username"
              name="username"
              onChange={handleInputChange}
              value={userFormData.username}
              required
            />
            {validated && !userFormData.username && (
              <p className="help is-danger">Username is required!</p>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <div className="control">
            <input
              className={`input ${validated && !userFormData.email ? "is-danger" : ""}`}
              type="email"
              placeholder="Your email address"
              name="email"
              onChange={handleInputChange}
              value={userFormData.email}
              required
            />
            {validated && !userFormData.email && (
              <p className="help is-danger">Email is required!</p>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="control">
            <input
              className={`input ${validated && !userFormData.password ? "is-danger" : ""}`}
              type="password"
              placeholder="Your password"
              name="password"
              onChange={handleInputChange}
              value={userFormData.password}
              required
            />
          </div>
        </div>

        <button
          className={`button is-success ${!(userFormData.username && userFormData.email && userFormData.password) ? "is-disabled" : ""}`}
          type="submit"
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
