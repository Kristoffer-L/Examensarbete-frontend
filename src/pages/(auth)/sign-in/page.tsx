"use client";
import { useState } from "react";

function SignInPage() {
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
      console.log("email", email);
      console.log("password", password);
      console.log("formData", formData);
      const response = await fetch(``, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Unauthorized");
        setErrors(errorData.errors || {});
        return;
      }

      // Fetch User Profile after successful sign-in
      const profileRes = await fetch(``, {
        credentials: "include",
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const user = await profileRes.json();
      console.log("user from profile:", user);
      localStorage.removeItem("redirectPath");
    } catch (err: any) {
      // console.error(err);
      setError(err?.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Email:</label>
        <input type="email" name="email" required />
        {errors.email && (
          <p style={{ color: "red" }}>{errors.email.join(", ")}</p>
        )}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" required />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.join(", ")}</p>
        )}
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignInPage;
