import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  fetchCompanyProfile,
  updateCompanyProfile,
  createCompanyProfile
} from "@/redux/thunks/companyThunk";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";

interface ProfileFormData {
  name: string;
  description: string;
}

const CompanyProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.company);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanyProfile())
      .unwrap()
      .then((data) => {
        // Assuming API returns { data: { companyProfile: { name, description } } }
        // or something similar.
        const prof = data?.data;
        if (prof) {
          setValue("name", prof.name || "");
          setValue("description", prof.description || "");
        } else {
          setIsCreating(true);
        }
      })
      .catch(() => {
        // If not found, we might need to create it
        setIsCreating(true);
      });
  }, [dispatch, setValue]);

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name || "");
      setValue("description", profile.description || "");
      setIsCreating(false);
    }
  }, [profile, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (isCreating) {
        await dispatch(createCompanyProfile(data)).unwrap();
        toast.success("Profile created successfully!");
        setIsCreating(false);
        setIsEditing(false);
        dispatch(fetchCompanyProfile());
      } else {
        await dispatch(updateCompanyProfile(data)).unwrap();
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        dispatch(fetchCompanyProfile());
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to save profile");
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>
            Manage your company's public information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                disabled={!isEditing && !isCreating}
                {...register("name", { required: "Company name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">About the Company</Label>
              <Textarea
                id="description"
                rows={5}
                disabled={!isEditing && !isCreating}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {!isEditing && !isCreating ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                {!isCreating && (
                  <Button type="button" variant="outline" onClick={() => {
                    setIsEditing(false);
                    setValue("name", profile?.name || "");
                    setValue("description", profile?.description || "");
                  }}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompanyProfile;
