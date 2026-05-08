import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { registerAdmin } from "@/redux/thunks/superadmin/adminThunks";
import { toast } from "sonner";
import { X, Info, User, ShieldCheck, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerAdmin(form)).unwrap();
      toast.success("Administrator registered successfully");
      onSuccess?.();
      onClose();
      // Reset form
      setForm({
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
    } catch (err: any) {
      toast.error(err || "Failed to register administrator");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className="
      w-[96vw]
      max-w-6xl
      h-[92vh]
      max-h-[92vh]
      p-0
      overflow-hidden
      border
      border-slate-200
      bg-white
      shadow-2xl
      rounded-3xl
      flex
      flex-col
    "
      >
        {/* Header */}
        <div className="px-6 lg:px-10 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <DialogTitle className="text-xl lg:text-2xl font-semibold text-slate-800 tracking-tight">
              Register New Administrator
            </DialogTitle>

            <p className="text-sm text-slate-400 mt-1">
              System Deployment Interface
            </p>
          </div>

          <button
            onClick={onClose}
            className="
          size-10
          rounded-full
          hover:bg-slate-100
          flex
          items-center
          justify-center
          text-slate-400
          hover:text-slate-600
          transition-all
          border
          border-slate-200
          shrink-0
        "
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="p-6 lg:p-10 xl:p-12 space-y-10"
          >
            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-14">

              {/* Personnel Section */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 space-y-8 shadow-sm">

                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="size-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <User className="size-4" />
                  </div>

                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-[0.2em]">
                    Personnel Identity
                  </h3>
                </div>

                <div className="space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-slate-500">
                        First Name
                      </Label>

                      <Input
                        name="firstname"
                        placeholder="John"
                        value={form.firstname}
                        onChange={handleChange}
                        className="
                      h-12
                      bg-slate-50
                      border-slate-200
                      rounded-xl
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:border-blue-500
                      transition-all
                      text-sm
                    "
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-slate-500">
                        Last Name
                      </Label>

                      <Input
                        name="lastname"
                        placeholder="Doe"
                        value={form.lastname}
                        onChange={handleChange}
                        className="
                      h-12
                      bg-slate-50
                      border-slate-200
                      rounded-xl
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:border-blue-500
                      transition-all
                      text-sm
                    "
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-[12px] font-medium text-slate-500">
                      Email Address
                    </Label>

                    <Input
                      name="email"
                      type="email"
                      placeholder="john.doe@university.edu"
                      value={form.email}
                      onChange={handleChange}
                      className="
                    h-12
                    bg-slate-50
                    border-slate-200
                    rounded-xl
                    focus:ring-4
                    focus:ring-blue-500/10
                    focus:border-blue-500
                    transition-all
                    text-sm
                  "
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-[12px] font-medium text-slate-500">
                      Password
                    </Label>

                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="
                    h-12
                    bg-slate-50
                    border-slate-200
                    rounded-xl
                    focus:ring-4
                    focus:ring-blue-500/10
                    focus:border-blue-500
                    transition-all
                    text-sm
                  "
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Institutional Section */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 space-y-8 shadow-sm">

                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="size-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>

                  <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-[0.2em]">
                    Institutional Node
                  </h3>
                </div>

                <div className="space-y-6">

                  <div className="space-y-2.5">
                    <Label className="text-[12px] font-medium text-slate-500">
                      University Name
                    </Label>

                    <Input
                      name="university.name"
                      placeholder="Global Technical University"
                      value={form.university.name}
                      onChange={handleChange}
                      className="
                    h-12
                    bg-slate-50
                    border-slate-200
                    rounded-xl
                    focus:ring-4
                    focus:ring-blue-500/10
                    focus:border-blue-500
                    transition-all
                    text-sm
                  "
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-slate-500">
                        Node Code
                      </Label>

                      <Input
                        name="university.code"
                        placeholder="GTU-01"
                        value={form.university.code}
                        onChange={handleChange}
                        className="
                      h-12
                      bg-slate-50
                      border-slate-200
                      rounded-xl
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:border-blue-500
                      transition-all
                      text-sm
                      uppercase
                    "
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-slate-500">
                        City
                      </Label>

                      <Input
                        name="university.city"
                        placeholder="San Francisco"
                        value={form.university.city}
                        onChange={handleChange}
                        className="
                      h-12
                      bg-slate-50
                      border-slate-200
                      rounded-xl
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:border-blue-500
                      transition-all
                      text-sm
                    "
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-slate-500">
                        State
                      </Label>

                      <Input
                        name="university.state"
                        placeholder="California"
                        value={form.university.state}
                        onChange={handleChange}
                        className="
                      h-12
                      bg-slate-50
                      border-slate-200
                      rounded-xl
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:border-blue-500
                      transition-all
                      text-sm
                    "
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-slate-500">
                        Country
                      </Label>

                      <Input
                        name="university.country"
                        placeholder="United States"
                        value={form.university.country}
                        onChange={handleChange}
                        className="
                      h-12
                      bg-slate-50
                      border-slate-200
                      rounded-xl
                      focus:ring-4
                      focus:ring-blue-500/10
                      focus:border-blue-500
                      transition-all
                      text-sm
                    "
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Box */}
            <div
              className="
            rounded-3xl
            border
            border-slate-200
            bg-gradient-to-br
            from-slate-50
            to-white
            p-6 lg:p-8
            flex
            flex-col
            sm:flex-row
            gap-5
            items-start
            sm:items-center
          "
            >
              <div
                className="
              size-12
              rounded-2xl
              bg-blue-600
              flex
              items-center
              justify-center
              text-white
              shrink-0
              shadow-lg
              shadow-blue-600/20
            "
              >
                <Info className="size-5" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  Deployment Protocol
                </p>

                <p className="text-sm text-slate-500 leading-relaxed">
                  By creating this administrator, you are granting full system
                  access to the specified institutional node. The node will be
                  active immediately upon creation.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className="
        px-6
        lg:px-10
        py-5
        border-t
        border-slate-100
        bg-white/90
        backdrop-blur-xl
        flex
        flex-col-reverse
        sm:flex-row
        items-center
        justify-between
        gap-4
        shrink-0
      "
        >
          <Button
            variant="outline"
            onClick={onClose}
            className="
          w-full
          sm:w-auto
          px-8
          rounded-xl
          font-medium
          text-slate-600
          border-slate-200
          hover:bg-slate-100
          transition-all
          h-11
          text-sm
        "
          >
            Discard
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
          w-full
          sm:w-auto
          px-10
          rounded-xl
          font-semibold
          text-sm
          h-11
          bg-blue-600
          hover:bg-blue-700
          text-white
          shadow-lg
          shadow-blue-600/20
          transition-all
          flex
          items-center
          justify-center
          gap-2
        "
          >
            {isSubmitting ? (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}

            <span>Deploy Administrator</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
