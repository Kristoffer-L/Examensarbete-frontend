"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";

function SignUpPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    setErrors({});

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${API_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("response", data);
      } else {
        throw new Error("error");
      }
      console.log("name", name);
      console.log("email", email);
      console.log("password", password);
      console.log("formData", formData);

      navigate("/sign-in");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    }
  }

  return (
    <div className="flex flex-col bg-green-400 w-[50%] rounded-2xl m-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h1 className="text-center text-2xl">Sign Up</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <label>Name:</label>
          <input
            className="flex bg-white border rounded-md"
            type="text"
            name="name"
            autoComplete="current-name"
            required
          />
          {errors.name && (
            <p style={{ color: "red" }}>{errors.name.join(", ")}</p>
          )}
        </div>
        <div>
          <label>Email:</label>
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
          <label>Password:</label>
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
          className="bg-green-600 text-white border border-black rounded-md self-center py-2 px-6 m-4 hover:bg-green-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
