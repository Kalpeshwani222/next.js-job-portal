"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { JobFormData, jobSchema } from "../jobs/jobs.schema";
import { Label } from "@/components/ui/label";
import {
  Badge,
  Briefcase,
  Building2,
  DollarSign,
  Loader,
  LocateIcon,
  MapPin,
  Tags,
  TypeIcon,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUC,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constants";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createJobAction } from "../server/job.action";
import { toast } from "sonner";
import RichTextEditor from "@/components/text-editor";

const PostJobFrom = () => {
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormData) => {
    const result = await createJobAction(data);

    if (result.status === "success") {
      toast.success(result.message);
    } else toast.error(result.message);
  };

  return (
    <Card className="w-3/4 mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create Job</CardTitle>
        <CardDescription>
          Fill out all required details to publish your job posting
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Senior Backend Developer"
                className={`pl-10 ${errors.title ? "border-destructive" : ""}`}
                {...register("title")}
              />
            </div>
            <p className="text-sm text-destructive">{errors.title?.message}</p>
          </div>
          {/* JOB TYPE / WORK TYPE / LEVEL */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label>Job Type</Label>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="jobType"
                      className={`w-full ${errors.jobType} ? "border-destructive" : ""`}
                    >
                      <SelectValue placeholder="Select Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPE.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobType && (
                <p className="text-sm text-destructive">
                  {errors.jobType.message}
                </p>
              )}
            </div>

            <div>
              <Label>Work Type</Label>
              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="workType"
                      className={`w-full ${errors.workType} ? "border-destructive" : ""`}
                    >
                      <SelectValue placeholder="Select Work Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_TYPE.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.workType && (
                <p className="text-sm text-destructive">
                  {errors.workType.message}
                </p>
              )}
            </div>
            <div>
              <Label>Job Level</Label>
              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="jobLevel"
                      className={`w-full ${errors.jobLevel} ? "border-destructive" : ""`}
                    >
                      <SelectValue placeholder="Select job level" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_LEVEL.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobLevel && (
                <p className="text-sm text-destructive">
                  {errors.jobLevel.message}
                </p>
              )}
            </div>
          </div>
          {/* LOCATION */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Remote / New York"
                  className={`pl-10 ${
                    errors.location ? "border-destructive" : ""
                  }`}
                  {...register("location")}
                />
              </div>
              <p className="text-sm text-destructive">
                {errors.location?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tags (Optional)</Label>

              <div className="relative">
                <Tags className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={tagInput}
                  placeholder="Type a tag and press Enter"
                  className={`pl-10 ${errors.tags ? "border-destructive" : ""}`}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const value = tagInput.trim();
                      if (!value) return;

                      const current = watch("tags") || [];
                      if (!current.includes(value)) {
                        setValue("tags", [...current, value], {
                          shouldValidate: true,
                        });
                      }
                      setTagInput("");
                    }
                  }}
                />
              </div>

              {/* TAG BADGES */}
              <div className="flex flex-wrap gap-2">
                {(watch("tags") || []).map((tag: string) => (
                  <Badge key={tag} className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() =>
                        setValue(
                          "tags",
                          watch("tags")?.filter((t: string) => t !== tag),
                          { shouldValidate: true },
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              {errors.tags && (
                <p className="text-sm text-destructive">
                  {errors.tags.message}
                </p>
              )}
            </div>
          </div>
          {/* salary */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base">Min salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Min salary"
                  className={`pl-10 ${
                    errors.minSalary ? "border-destructive" : ""
                  }`}
                  {...register("minSalary")}
                />
              </div>
              <p className="text-sm text-destructive">
                {errors.minSalary?.message || errors.maxSalary?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Max Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Max salary"
                  className={`pl-10 ${
                    errors.maxSalary ? "border-destructive" : ""
                  }`}
                  {...register("maxSalary")}
                />
              </div>
              <p className="text-sm text-destructive">
                {errors.maxSalary?.message || errors.maxSalary?.message}
              </p>
            </div>
          </div>
          {/* currency  */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Salary Currency</Label>
              <Controller
                name="salaryCurrency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.salaryCurrency} ? "border-destructive" : ""`}
                    >
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_CURRENCY.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <p className="text-sm text-destructive">
                {errors.salaryCurrency?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Salary Period</Label>
              <Controller
                name="salaryPeriod"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.salaryPeriod} ? "border-destructive" : ""`}
                    >
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_PERIOD.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <p className="text-sm text-destructive">
                {errors.salaryPeriod?.message}
              </p>
            </div>
          </div>
          {/* education */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Minimum Education (Optional)</Label>
              <Controller
                name="minEducation"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.minEducation} ? "border-destructive" : ""`}
                    >
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      {MIN_EDUC.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Input
                type="date"
                className={errors.expiresAt ? "border-destructive" : ""}
                {...register("expiresAt")}
              />
              <p className="text-sm text-destructive">
                {errors.expiresAt?.message}
              </p>
            </div>
          </div>
          {/* experience */}
          <div className="space-y-2">
            <Label>Experience (Optional)</Label>
            <Input
              placeholder="3+ years of experience"
              className={errors.experience ? "border-destructive" : ""}
              {...register("experience")}
            />
          </div>
          {/* desc */}

          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>

                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                  />

                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={6}
              placeholder="Detailed job description..."
              className={errors.description ? "border-destructive" : ""}
              {...register("description")}
            />
            <p className="text-sm text-destructive">
              {errors.description?.message}
            </p>
          </div> */}
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" className="px-10">
              Publish Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostJobFrom;
