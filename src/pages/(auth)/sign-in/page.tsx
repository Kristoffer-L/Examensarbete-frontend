"use client";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../../config";

function SignInPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    setErrors({});

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("response", data);
        localStorage.setItem("token", data.token);
      } else {
        throw new Error("Wrong email or password");
      }
      console.log("email", email);
      console.log("password", password);
      console.log("formData", formData);

      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    }
  }

  return (
    <div className="flex flex-col bg-[#007500] w-[50%] rounded-2xl m-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 className="text-white text-center text-2xl">Sign In</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label className="text-white">Email:</label>
          <input
            className="flex bg-white border rounded-md"
            type="email"
            name="email"
            autoComplete="current-email"
            required
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.join(", ")}</p>
          )}
        </div>
        <div>
          <label className="text-white">Password:</label>
          <input
            className="flex bg-white border rounded-md"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.join(", ")}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white rounded-md self-center py-2 px-6 m-4 hover:bg-green-700"
        >
          Sign In
        </button>
      </form>
      <p className="text-white">Don't have an account?</p>
      <Link to="/sign-up" className="text-white underline text-bold">
        Sign up here.
      </Link>
    </div>
  );
}

export default SignInPage;
