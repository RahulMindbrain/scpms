import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { registerAdmin } from "@/redux/thunks/superadmin/adminThunks";
import { toast } from "sonner";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const CreateAdminModal = ({ open, onClose, onSuccess }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSubmitting } = useSelector((state: any) => state.superAdmin);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "ADMIN",
    university: {
      name: "",
      code: "",
      city: "",
      state: "",
      country: "India",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("university.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        university: {
          ...prev.university,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(registerAdmin(form)).unwrap();

      toast.success("Admin created successfully");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to create admin");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[600px] bg-white rounded-2xl shadow-xl p-6 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Create Administrator</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-3">
          <Input name="firstname" placeholder="First Name" onChange={handleChange} />
          <Input name="lastname" placeholder="Last Name" onChange={handleChange} />
          <Input name="email" placeholder="Email" onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" onChange={handleChange} />
        </div>

        <hr />

        <div className="grid grid-cols-2 gap-3">
          <Input name="university.name" placeholder="University Name" onChange={handleChange} />
          <Input name="university.code" placeholder="Code" onChange={handleChange} />
          <Input name="university.city" placeholder="City" onChange={handleChange} />
          <Input name="university.state" placeholder="State" onChange={handleChange} />
          <Input name="university.country" placeholder="Country" onChange={handleChange} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Admin"}
          </Button>
        </div>
      </div>
    </div>
  );
};