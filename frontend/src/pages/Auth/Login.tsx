import React, { useState, useId } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import type { Props } from "../../types";

/* ── SVG icon helpers ── */
const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="field-icon"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconLock = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="field-icon"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="18"
    height="18"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="18"
    height="18"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconLogoMark = () => (
  <svg viewBox="0 0 24 24" fill="white">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const IconArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ── Google logo ── */
const GoogleLogo = () => (
  <svg viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/* ── GitHub logo ── */
const GithubLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

/* ─────────────────────────────── */

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const validate = (values: FormState): FormErrors => {
  const errors: FormErrors = {};
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "At least 6 characters.";
  }
  return errors;
};

/* ─────────────────────────────── */
// type Props = {
//   setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
// };

const Login: React.FC<Props> = ({ setIsLoggedIn }) => {
  const emailId = useId();
  const passId = useId();
  const checkId = useId();

  const [values, setValues] = useState<FormState>({
    email: "",
    password: "",
    remember: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));

    // เก็บ token (เปลี่ยนเป็น API จริงได้เลย)
    localStorage.setItem("auth_token", "demo-token");

    setLoading(false);
    setSuccess(true);
    setIsLoggedIn(true);
    setTimeout(() => navigate("/dashboard"), 800);
    // navigate("/dashboard");
  };

  return (
    <div className="login-root">
      {/* ── Left panel ── */}
      <aside className="login-panel" aria-hidden="true">
        <div className="panel-deco">
          <div className="deco-circle-1" />
          <div className="deco-circle-2" />
          <div className="deco-bar" />
        </div>

        <div className="panel-logo">
          <div className="panel-logo-mark">
            <IconLogoMark />
          </div>
          <span className="panel-logo-name">Stackr</span>
        </div>

        <div className="panel-copy">
          <h2 className="panel-headline">
            Build faster.
            <br />
            Ship <span>smarter.</span>
            <br />
            Scale effortlessly.
          </h2>
          <p className="panel-sub">
            The platform trusted by 40,000+ teams to manage, deploy, and iterate
            on their products—without the ops overhead.
          </p>
        </div>

        <div className="panel-tags">
          <span className="panel-tag">No-code deploy</span>
          <span className="panel-tag">Real-time analytics</span>
          <span className="panel-tag">SOC 2 Type II</span>
          <span className="panel-tag">99.99% uptime</span>
        </div>
      </aside>

      {/* ── Right: form ── */}
      <main className="login-form-wrap">
        <div className="login-card">
          {success ? (
            <div className="success-screen">
              <div className="success-icon">
                <IconCheck />
              </div>
              <h2 className="success-title">You're in!</h2>
              <p className="success-sub">
                Welcome back. Redirecting you to your dashboard&hellip;
              </p>
            </div>
          ) : (
            <>
              <header className="card-header">
                <p className="card-eyebrow">Welcome back</p>
                <h1 className="card-title">Sign in to Stackr</h1>
                <p className="card-subtitle">
                  New here?&nbsp;
                  <a href="#">Create a free account</a>
                </p>
              </header>

              {/* Social row */}
              <div className="social-row" style={{ marginBottom: "20px" }}>
                <button
                  type="button"
                  className="btn-social"
                  aria-label="Sign in with Google"
                >
                  <GoogleLogo /> Google
                </button>
                <button
                  type="button"
                  className="btn-social"
                  aria-label="Sign in with GitHub"
                >
                  <GithubLogo /> GitHub
                </button>
              </div>

              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">or continue with email</span>
                <span className="divider-line" />
              </div>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="field-group">
                  <label htmlFor={emailId} className="field-label">
                    Email address
                  </label>
                  <div className="field-input-wrap">
                    <input
                      id={emailId}
                      type="email"
                      name="email"
                      className={`field-input${
                        errors.email ? " has-error" : ""
                      }`}
                      placeholder="you@company.com"
                      value={values.email}
                      onChange={handleChange}
                      autoComplete="email"
                      autoFocus
                    />
                    <IconMail />
                  </div>
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>

                {/* Password */}
                <div className="field-group">
                  <label htmlFor={passId} className="field-label">
                    Password
                  </label>
                  <div className="field-input-wrap">
                    <input
                      id={passId}
                      type={showPass ? "text" : "password"}
                      name="password"
                      className={`field-input${
                        errors.password ? " has-error" : ""
                      }`}
                      placeholder="Your password"
                      value={values.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    <IconLock />
                    <button
                      type="button"
                      className="field-toggle"
                      onClick={() => setShowPass((s) => !s)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="field-error">{errors.password}</span>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="form-meta">
                  <label className="checkbox-wrap" htmlFor={checkId}>
                    <input
                      id={checkId}
                      type="checkbox"
                      name="remember"
                      className="checkbox-input"
                      checked={values.remember}
                      onChange={handleChange}
                    />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner" /> Signing in…
                    </>
                  ) : (
                    <>
                      Sign in <IconArrow />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
