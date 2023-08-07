import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations";
import { authService } from "../utils/auth";

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // useMutation hook
  const [loginUser] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    try {
      // loginUser mutation
      const { data } = await loginUser({
        variables: {
          email: userFormData.email,
          password: userFormData.password,
        },
      });

      // const { token, user } = await response.json();
      // console.log(user);
      const { token } = data.login;
      authService.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      email: "",
      password: "",
    });
  
  };

  return (
    <>
      <form noValidate className="box" onSubmit={handleFormSubmit}>
        {showAlert && (
          <div className="notification is-danger">
            Something went wrong with your login credentials!
          </div>
        )}
        <div className="field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="control">
            <input
              type="text"
              placeholder="Your email"
              name="email"
              className="input"
              onChange={handleInputChange}
              value={userFormData.email}
              required
            />
            <p className="help is-danger">
              {validated && !userFormData.email && "Email is required!"}
            </p>
          </div>
        </div>

        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              type="password"
              placeholder="Your password"
              name="password"
              className="input"
              onChange={handleInputChange}
              value={userFormData.password}
              required
            />
            <p className="help is-danger">
              {validated && !userFormData.password && "Password is required!"}
            </p>
          </div>
        </div>

        <button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          className="button is-success"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default LoginForm;
