
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "./hook/user";
import { useState, useEffect } from "react";

function Home() {
  const { user, setUser, isLoading } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [originalData, setOriginalData] = useState({ name: "", email: "", image: "" });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setImage(user.image || "");
      setOriginalData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });
    }
  }, [user]);

  // Handle Image Upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setImage(result.url);
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Handle Profile Update
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, image }),
      });

      const result = await res.json();
      console.log("Update result:", result);

      if (res.ok) {
        setUser(result.user);
        setOriginalData({ name, email, image });
        alert("Profile updated successfully!");
        setEditing(false);
      } else {
        alert(result.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating profile");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setName(originalData.name);
    setEmail(originalData.email);
    setImage(originalData.image);
    setEditing(false);
  };

  if (isLoading) return <div className="max-w-md mx-auto py-8 px-5">Loading...</div>;

  return (
    <div className="max-w-md mx-auto py-8 px-5">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Profile Image */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <img
          src={image || "/default-avatar.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
        />
        {editing && (
          <p className="text-sm text-gray-500">
            {uploading ? "Uploading..." : "Click below to change photo"}
          </p>
        )}
      </div>

      {/* Image Upload */}
      {editing && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 cursor-pointer hover:border-teal-500">
          <label htmlFor="image-upload" className="cursor-pointer block text-center">
            <span className="text-teal-500 font-medium">Choose Image</span>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {/* Profile Form */}
      <div className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          disabled={!editing}
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          disabled={!editing}
        />

        {!editing ? (
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-teal-500 hover:bg-teal-600"
              onClick={handleUpdate}
              disabled={uploading}
            >
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
