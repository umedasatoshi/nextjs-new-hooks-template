"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { addPostAction } from "@/lib/actions";
import SubmitButton from "./SubmitButton";
import { useFormState } from "react-dom";

export default function PostForm() {
  const initialstate = { error: undefined, success: false };
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(addPostAction, initialstate);

  if (state.success && formRef.current) {
    // Reset the form
    if (formRef.current) {
      formRef.current.reset();
    }
  }

  // const [error, setError] = useState<string | undefined>("");

  // const handleSubmit = async (formData: FormData) => {
  //   const result = await addPostAction(formData);

  //   if (!result?.success) {
  //     setError(result?.error);
  //   } else {
  //     setError("");

  //     // Reset the form
  //     if (formRef.current) {
  //       formRef.current.reset();
  //     }
  //   }
  // };

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <form
          ref={formRef}
          action={formAction}
          className="flex-1 flex items-center gap-4"
        >
          <Input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 rounded-full bg-muted px-4 py-2"
            name="post"
          />
          <SubmitButton />
        </form>
      </div>

      {state.error && (
        <div className="text-destructive mt-1 ml-14">{state.error}</div>
      )}
    </div>
  );
}
