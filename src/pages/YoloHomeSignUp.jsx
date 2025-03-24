import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const YoloHomeSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",  // Đổi thành firstName
    lastName: "",   // Đổi thành lastName
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra các trường bắt buộc
    const { firstName, lastName, phone, email, password, repeatPassword } = formData;
    if (!firstName || !lastName || !phone || !email || !password) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }
    if (password !== repeatPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/v1/user/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,  // Sửa thành firstName
          lastName: formData.lastName,    // Sửa thành lastName
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          // avatar và sensorId là tùy chọn, có thể thêm nếu cần
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        if (response.status === 409) {
          setError("Email hoặc số điện thoại đã tồn tại!");
        } else {
          setError(data.message || "Đăng ký thất bại!");
        }
      } else {
        // Lưu accessToken nếu cần
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("isAuthenticated", "true"); // Đồng bộ với App
        alert("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="flex h-screen w-full font-poppins">
      <div className="w-2/5 relative bg-neutral-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('signin.png')" }}
        />
        <div className="relative z-10 flex flex-col pt-36 px-16">
          <h1 className="text-4xl font-bold">Join YoloHome</h1>
          <p className="text-xl mt-2">Your journey to smarter living starts here.</p>
        </div>
      </div>

      <div className="w-3/5 flex flex-col justify-center items-center px-16 bg-white">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-wider text-gray-900">YOLOHOME</h1>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-gray-900">Sign Up</h2>
          {error && <p className="text-red-500 mb-4 bg-red-100 p-2 rounded">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                name="firstName"  // Sửa tên input thành firstName
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"  // Sửa tên input thành lastName
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-1/2 px-4 py-3 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 text-gray-900"
                disabled={loading}
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 text-gray-900"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 text-gray-900"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 text-gray-900"
              disabled={loading}
            />
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat Password"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md border-gray-300 focus:ring-1 focus:ring-blue-500 text-gray-900"
              disabled={loading}
            />
            <button
              type="submit"
              className={`w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200 mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Log In
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YoloHomeSignUp;