import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setMessage("Google login successful!");
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  return (
    <div>
      <h2>Log In</h2>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Log In</button>
      </form>
      <p>{message}</p>
      <p>
        Don't have an account?{" "}
        <button onClick={onSwitch}>Sign Up</button>
      </p>
      <p>
        Forgot password?{" "}
        <button onClick={() => {
            const emailPrompt = prompt("Enter your email:");
            if (emailPrompt) {
            import("firebase/auth").then(({ sendPasswordResetEmail }) => {
                sendPasswordResetEmail(auth, emailPrompt)
                .then(() => alert("Password reset email sent!"))
                .catch((e) => alert(e.message));
            });
            }
        }}>
    Reset
  </button>
</p>

    </div>
  );
}

export default Login;
