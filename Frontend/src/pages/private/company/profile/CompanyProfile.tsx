import { useEffect, useState } from "react"
import { Briefcase } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  fetchCompanyProfile,
  updateCompanyProfile,
  createCompanyProfile,
} from "@/redux/thunks/companyThunk"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AppDispatch } from "@/redux/store/store"
import type { RootState } from "@/redux/reducers/rootReducer"
import Loader from "@/components/Loader"

interface ProfileFormData {
  name: string
  description: string
}

const CompanyProfile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, loading } = useSelector((state: RootState) => state.company)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>()
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    dispatch(fetchCompanyProfile())
      .unwrap()
      .then((data) => {
        // Assuming API returns { data: { companyProfile: { name, description } } }
        // or something similar.
        const prof = data?.data
        if (prof) {
          setValue("name", prof.name || "")
          setValue("description", prof.description || "")
        } else {
          setIsCreating(true)
        }
      })
      .catch(() => {
        // If not found, we might need to create it
        setIsCreating(true)
      })
  }, [dispatch, setValue])

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name || "")
      setValue("description", profile.description || "")
      setIsCreating(false)
    }
  }, [profile, setValue])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (isCreating) {
        await dispatch(createCompanyProfile(data)).unwrap()
        toast.success("Profile created successfully!")
        setIsCreating(false)
        setIsEditing(false)
        dispatch(fetchCompanyProfile())
      } else {
        await dispatch(updateCompanyProfile(data)).unwrap()
        toast.success("Profile updated successfully!")
        setIsEditing(false)
        dispatch(fetchCompanyProfile())
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to save profile")
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Company Profile</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage your company's identity and public presence.</p>
        </div>
      </div>

      <div className="saas-card max-w-4xl mx-auto w-full p-0 overflow-hidden">
        <header className="p-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
             <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase size={32} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-foreground">{profile?.name || "New Company"}</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Enterprise Identity</p>
             </div>
          </div>
        </header>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 md:p-10 space-y-8">
            <div className="space-y-2">
              <label className="saas-label">Company Name</label>
              <input
                id="name"
                className="saas-input"
                disabled={!isEditing && !isCreating}
                {...register("name", { required: "Company name is required" })}
              />
              {errors.name && (
                <p className="text-xs font-bold text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="saas-label">About the Company</label>
              <textarea
                id="description"
                rows={6}
                className="saas-input py-3 resize-none"
                disabled={!isEditing && !isCreating}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-xs font-bold text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <footer className="p-6 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
            {!isEditing && !isCreating ? (
              <Button type="button" onClick={() => setIsEditing(true)} className="rounded-xl font-bold px-6">
                Edit Profile
              </Button>
            ) : (
              <>
                {!isCreating && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl font-bold px-6"
                    onClick={() => {
                      setIsEditing(false)
                      setValue("name", profile?.name || "")
                      setValue("description", profile?.description || "")
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={loading} className="rounded-xl font-bold px-8 min-w-[140px]">
                  {loading ? <Loader size="sm" /> : "Save Changes"}
                </Button>
              </>
            )}
          </footer>
        </form>
      </div>
    </div>
  )
}

export default CompanyProfile
