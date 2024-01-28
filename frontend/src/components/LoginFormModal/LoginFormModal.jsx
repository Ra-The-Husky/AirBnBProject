import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const errs = {};
    if (credential.length < 4) {
      errs.credential = true;
    }
    if (password.length < 6) {
      errs.password = true;
    }
    setErrors(errs);
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = (e) => {
    e.preventDefault();
    setCredential("Demo-lition");
    setPassword("password");
  };

  return (
    <div className="profileForm">
      <h1>Log In</h1>
      <form className="fields" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Username or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />

        <input
        className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="submitButton"
          disabled={Object.values(errors).length}
          type="submit"
        >
          Log In
        </button>
        {errors.credential && <p>{errors.credential}</p>}
        <label className="demo" onClick={demoUser}>
          Demo User
        </label>
      </form>
    </div>
  );
}

export default LoginFormModal;
