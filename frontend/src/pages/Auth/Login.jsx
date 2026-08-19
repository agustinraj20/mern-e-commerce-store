import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Loader from "../../components/Loader";

import { useLoginMutation } from "../../redux/api/usersApiSlice";

import { setCredentials } from "../../redux/features/auth/authSlice";

import { toast } from "react-toastify";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector(
    (state) => state.auth
  );

  const { search } = useLocation();

  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect");


  /*
  ====================================================
  IF ALREADY LOGGED IN
  ====================================================
  */

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin === true) {
        navigate("/admin/dashboard");
      } else {
        navigate(redirect || "/");
      }
    }
  }, [
    userInfo,
    navigate,
    redirect,
  ]);


  /*
  ====================================================
  LOGIN
  ====================================================
  */

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      const res = await login({
        email: email.trim(),
        password,
      }).unwrap();

      console.log("LOGIN RESPONSE:", res);

      /*
      Store user information in Redux
      */

      dispatch(
        setCredentials({
          ...res,
        })
      );

      toast.success("Login successful");


      /*
      Send admin to dashboard
      */

      if (res.isAdmin === true) {
        navigate("/admin/dashboard");
      } else {
        navigate(redirect || "/");
      }

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      toast.error(
        err?.data?.message ||
        err?.data ||
        err?.error ||
        "Invalid email or password"
      );
    }
  };


  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-center">

        {/* LOGIN FORM */}

        <div className="w-full max-w-xl">

          <div className="rounded-xl bg-[#151515] p-6 shadow-lg sm:p-8">

            <h1 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">
              Sign In
            </h1>

            <p className="mb-8 text-sm text-gray-400">
              Login to your account.
            </p>


            <form onSubmit={submitHandler}>

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
                  placeholder="Enter email"
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

              <div className="mb-6">

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter password"
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


              {/* LOGIN BUTTON */}

              <button
                disabled={isLoading}
                type="submit"
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
                  ? "Signing In..."
                  : "Sign In"}
              </button>


              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <Loader />
                </div>
              )}

            </form>


            {/* REGISTER */}

            <div className="mt-6 border-t border-gray-700 pt-5 text-center">

              <p className="text-sm text-gray-400">

                New Customer?{" "}

                <Link
                  to={
                    redirect
                      ? `/register?redirect=${encodeURIComponent(
                          redirect
                        )}`
                      : "/register"
                  }
                  className="font-medium text-pink-500 hover:underline"
                >
                  Register
                </Link>

              </p>

            </div>

          </div>

        </div>


        {/* IMAGE */}

        <div className="hidden w-full max-w-xl lg:block">

          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Login"
            className="
              h-[650px]
              w-full
              rounded-xl
              object-cover
              shadow-lg
            "
          />

        </div>

      </section>

    </div>
  );
};

export default Login;