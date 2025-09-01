"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Step1CoreDetails from "./signup/Step1CoreDetails";
import Step2ProfileBasics from "./signup/Step2ProfileBasics";
import Step3PhotoUpload from "./signup/Step3PhotoUpload";
import Step4Preferences from "./signup/Step4Preferences";
import StepIndicator from "./signup/StepIndicator";
import { showError, showSuccess } from "@/utils/toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z
  .object({
    // Step 1
    email: z.string().email({ message: "Please enter a valid email." }),
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    dateOfBirth: z.date({ required_error: "Your date of birth is required." }),

    // Step 2
    gender: z.string({ required_error: "Please select a gender." }),
    orientation: z.string({ required_error: "Please select an orientation." }),
    location: z.string().min(2, "Location is required."),
    bio: z.string().max(500, "Bio cannot exceed 500 characters.").optional(),

    // Step 3
    photos: z.array(z.any())
      .min(1, "Please upload at least one photo.")
      .max(6, "You can upload a maximum of 6 photos.")
      .refine(files => files.every(file => file instanceof File), "Invalid file format.")
      .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
      .refine(
        files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ),

    // Step 4
    relationshipGoals: z.enum(["casual", "long-term", "friendship"], { required_error: "Please select your relationship goals." }),
    ageRange: z.array(z.number()).default([20, 35]),
    maxDistance: z.array(z.number()).default([50]),
    dealBreakers: z.object({ smoker: z.boolean().default(false) }).optional(),
    lifestyleTags: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (!data.dateOfBirth) return false;
      const today = new Date();
      const dob = new Date(data.dateOfBirth);
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= 18;
    },
    {
      message: "You must be at least 18 years old to sign up.",
      path: ["dateOfBirth"],
    }
  );

const stepFields: (keyof z.infer<typeof formSchema>)[][] = [
  ["email", "username", "dateOfBirth", "password", "confirmPassword"],
  ["gender", "orientation", "location", "bio"],
  ["photos"],
  ["relationshipGoals", "ageRange", "maxDistance", "dealBreakers", "lifestyleTags"],
];

const stepDescriptions = [
    "Enter your details to create an account.",
    "Tell us a bit about yourself.",
    "Add photos to your profile.",
    "What are you looking for in a match?",
]

export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      bio: "",
      location: "",
      photos: [],
      ageRange: [20, 35],
      maxDistance: [50],
      dealBreakers: { smoker: false },
      lifestyleTags: [],
    },
  });

  const next = async () => {
    const fields = stepFields[currentStep];
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    setCurrentStep((prev) => prev + 1);
  };

  const prev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { email, password, photos, ...profileData } = values;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...profileData
        },
      },
    });

    if (error) {
      showError(error.message);
    } else if (data.user) {
      // We will handle photo uploads in a future step.
      console.log("User created. Photo upload can be implemented here.");
      showSuccess("Account created! Please check your email to verify your account.");
      navigate("/login");
    }
    setLoading(false);
  }

  const onInvalid = (errors: any) => {
    console.error("Form validation errors:", errors);
    const firstErrorField = Object.keys(errors)[0] as keyof z.infer<typeof formSchema>;

    if (firstErrorField) {
      const stepWithError = stepFields.findIndex(fields => fields.includes(firstErrorField));
      if (stepWithError !== -1) {
        setCurrentStep(stepWithError);
        showError("Please fix the errors on this step before submitting.");
        return;
      }
    }
    showError("Please fix the errors before submitting.");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>{stepDescriptions[currentStep]}</CardDescription>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={currentStep} totalSteps={4} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6 mt-6">
            {currentStep === 0 && <Step1CoreDetails form={form} />}
            {currentStep === 1 && <Step2ProfileBasics form={form} />}
            {currentStep === 2 && <Step3PhotoUpload form={form} />}
            {currentStep === 3 && <Step4Preferences form={form} />}

            <div className="flex gap-4 justify-end">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prev}>
                  Back
                </Button>
              )}
              {currentStep < 3 && (
                <Button type="button" onClick={next}>
                  Next
                </Button>
              )}
              {currentStep === 3 && (
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}