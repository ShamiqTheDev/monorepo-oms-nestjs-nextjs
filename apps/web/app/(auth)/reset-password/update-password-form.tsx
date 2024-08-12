"use client";

import { styled } from "@atdb/design-system";
import { Input } from "@atdb/ui";
import { PasswordCheck } from "@atdb/icons";
import { updatePasswordReset } from "./action";
import { useFormState, useFormStatus } from "react-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testPassword } from "../../utils";

const VAStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <styled.button
      disbled={(pending || disabled).toString()}
      bg={pending || disabled ? "gray.200" : "primary.500"}
      boxShadow={"0px 9px 17px 0px hsla(254 46% 31% / 15%)"}
      py={"lg"}
      px={"3xl"}
      color={pending || disabled ? "gray.500" : "gray.25"}
      rounded={"8px"}
      type="submit">
      Reset Password
    </styled.button>
  );
}

export function UpdatePasswordForm({ token }: { token: string }) {
  const [state, action] = useFormState(updatePasswordReset, null);
  const router = useRouter();

  const [pass, setPass] = useState("");
  const [passConfirmation, setPassConfirmation] = useState("");
  const [passErr, setPassErr] = useState("");

  const onPassChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setPass(newPass);
    if (testPassword(newPass)) {
      if (passConfirmation) {
        if (passConfirmation === newPass) setPassErr("");
        else setPassErr("Password confirmation doesn't match password!");
      } else setPassErr("");
    } else {
      setPassErr("Passwords must consist of at least 8 characters and shouldn't contain any non-English letters!");
    }
  };

  const onPassConfirmationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPassConfirmation = e.target.value;
    setPassConfirmation(newPassConfirmation);
    if (newPassConfirmation !== pass) {
      setPassErr("Password confirmation doesn't match password!");
    } else if (testPassword(newPassConfirmation)) {
      setPassErr("");
    }
  };

  useEffect(() => {
    if (state?.ok) {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [state]);

  return (
    <form action={action}>
      <VAStack gap={"xl"}>
        <input type="hidden" name="token" value={token} />
        <Input.Root w={"full"}>
          <Input.Icon>
            <PasswordCheck size={"20px"} />
          </Input.Icon>
          <Input.Control type={"password"} placeholder="New password" name="password" value={pass} onChange={onPassChange} />
        </Input.Root>
        <Input.Root w={"full"}>
          <Input.Icon>
            <PasswordCheck size={"20px"} />
          </Input.Icon>
          <Input.Control
            type={"password"}
            placeholder="Confirm new password"
            name="passwordConfirmation"
            value={passConfirmation}
            onChange={onPassConfirmationChange}
          />
        </Input.Root>
        <SubmitButton disabled={!!(passErr || !passConfirmation)} />
        {state?.ok ? (
          <styled.p color={"constructive"}>Password has been updated successfully! redirecting..</styled.p>
        ) : (
          (passErr || state) && (
            <styled.p w="350px" color={"destructive"}>
              {passErr || state?.error || "Couldn't update password!"}
            </styled.p>
          )
        )}
      </VAStack>
    </form>
  );
}
