"use client";

import { styled } from "@atdb/design-system";
import { Input } from "@atdb/ui";
import { Sms } from "@atdb/icons";
import { requestPasswordReset } from "./action";
import { useFormState, useFormStatus } from "react-dom";

const VAStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <styled.button
      bg={pending ? "gray.200" : "primary.500"}
      boxShadow={"0px 9px 17px 0px hsla(254 46% 31% / 15%)"}
      py={"lg"}
      px={"3xl"}
      color={pending ? "gray.500" : "gray.25"}
      rounded={"8px"}
      type="submit"
      disabled={pending}
    >
      Request Reset
    </styled.button>
  );
}

export function PasswordResetForm() {
  const [state, action] = useFormState(requestPasswordReset, null);

  return (
    <form action={action}>
      <VAStack gap={"xl"}>
        <Input.Root w={"full"}>
          <Input.Icon>
            <Sms size={"20px"} />
          </Input.Icon>
          <Input.Control type={"email"} placeholder="Email" name="email" />
        </Input.Root>
        <SubmitButton />
      </VAStack>
      {state?.ok ? (
        <styled.p color={"constructive"}>Password verification email was sent successfully!</styled.p>
      ) : (
        state && <styled.p color={"destructive"}>Cannot send reset password verification email!</styled.p>
      )}
    </form>
  );
}
