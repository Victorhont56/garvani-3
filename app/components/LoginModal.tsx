// components/LoginModal.tsx
"use client";

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/components/useRegisterModal";
import useLoginModal from "@/app/components/useLoginModal";
import { supabase } from "@/app/lib/supabase/supabaseClient";
import Modal from "./Modal";
import InputTwo from "./InputTwo";
import Heading from "./Heading";
import Button from "./Button";
import StatusModal from "./StatusModal";

const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

// In your LoginModal.tsx, update the relevant parts:

const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
  
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
  
      if (error) {
        throw error;
      }
  
      setIsSuccess(true);
      setShowStatusModal(true);
      router.refresh();
      loginModal.onClose(); // No need for setTimeout here anymore
    } catch (error: any) {
      setIsSuccess(false);
      setShowStatusModal(true);
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Similarly for handleGoogleSignIn:
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`, // Dynamic URL
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });
  
      if (error) {
        console.error('Google OAuth error:', error)
      }
  
      setIsSuccess(true);
      setShowStatusModal(true);
      router.refresh();
      loginModal.onClose(); // No need for setTimeout here anymore
    } catch (error: any) {
      setIsSuccess(false);
      setShowStatusModal(true);
      toast.error(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };
  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <InputTwo
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <InputTwo
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-[5px]">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      />
      <div className="text-neutral-500 text-center mt-[5px] font-light">
        <p>
          First time using Garvani?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        title="Login"
        actionLabel="Continue"
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
      />
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        isSuccess={isSuccess}
        title="Logged in successfully"
        body={<p className="text-black">Login was successful!</p>}
      />
    </>
  );
};

export default LoginModal;