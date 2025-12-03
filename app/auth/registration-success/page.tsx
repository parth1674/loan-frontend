"use client";

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">

        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full text-4xl">
            ✓
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Registration Successful!
        </h1>

        <p className="text-gray-600 text-sm mb-6">
          Your registration has been submitted successfully.<br />
          Once approved by the admin, you will be able to login.
        </p>

        <a
          href="/auth/login"
          className="block bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
