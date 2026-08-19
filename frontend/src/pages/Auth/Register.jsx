import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader";

import { useRegisterMutation } from "../../redux/api/usersApiSlice";

import { setCredentials } from "../../redux/features/auth/authSlice";

import { toast } from "react-toastify";


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] =
    useRegisterMutation();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  const { search } = useLocation();

  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";


  /*
  ====================================================
  IF ALREADY LOGGED IN
  ====================================================
  */

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);


  /*
  ====================================================
  REGISTER
  ====================================================
  */

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }


    try {
      const res = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      }).unwrap();


      dispatch(
        setCredentials({
          ...res,
        })
      );


      toast.success(
        "User successfully registered"
      );


      navigate(redirect);

    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      toast.error(
        err?.data?.message ||
          err?.data ||
          err?.error ||
          "Registration failed"
      );
    }
  };


  return (
    <section className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-center">

        {/* REGISTER FORM */}

        <div className="w-full max-w-xl">

          <div className="rounded-xl bg-[#151515] p-6 shadow-lg sm:p-8">

            <h1 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">
              Create Account
            </h1>

            <p className="mb-8 text-sm text-gray-400">
              Register a new account to continue shopping.
            </p>


            <form onSubmit={submitHandler}>

              {/* NAME */}

              <div className="mb-5">

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-gray-900
                    outline-none
                    focus:border-pink-500
                    focus:ring-2
                    focus:ring-pink-200
                  "
                />

              </div>


              {/* EMAIL */}

              <div className="mb-5">

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-gray-900
                    outline-none
                    focus:border-pink-500
                    focus:ring-2
                    focus:ring-pink-200
                  "
                />

              </div>


              {/* PASSWORD */}

              <div className="mb-5">

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-gray-900
                    outline-none
                    focus:border-pink-500
                    focus:ring-2
                    focus:ring-pink-200
                  "
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="mb-6">

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Confirm Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-gray-900
                    outline-none
                    focus:border-pink-500
                    focus:ring-2
                    focus:ring-pink-200
                  "
                />

              </div>


              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full
                  rounded-lg
                  bg-pink-500
                  px-4
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isLoading
                  ? "Registering..."
                  : "Register"}
              </button>


              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <Loader />
                </div>
              )}

            </form>


            {/* LOGIN LINK */}

            <div className="mt-6 border-t border-gray-700 pt-5 text-center">

              <p className="text-sm text-gray-400">

                Already have an account?{" "}

                <Link
                  to={
                    redirect
                      ? `/login?redirect=${encodeURIComponent(
                          redirect
                        )}`
                      : "/login"
                  }
                  className="font-medium text-pink-500 hover:underline"
                >
                  Login
                </Link>

              </p>

            </div>

          </div>

        </div>


        {/* IMAGE */}

        <div className="hidden w-full max-w-xl lg:block">

          <img
            src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
            alt="Register"
            className="
              h-[650px]
              w-full
              rounded-xl
              object-cover
              shadow-lg
            "
          />

        </div>

      </div>

    </section>
  );
};


export default Register;