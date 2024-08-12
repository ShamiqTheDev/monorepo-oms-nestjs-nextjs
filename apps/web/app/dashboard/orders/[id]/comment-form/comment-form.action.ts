"use server";

import { Auth } from "@atdb/client-services";
import authOptions from "@atdb/auth-options";
import { getServerSession } from "next-auth";
// import { commentSchema } from "./content-form.schema";
import { DB } from "@atdb/types";
import { Insertable } from "kysely";
import { sendNotification, uploadAttachments } from "../../server-utils";
import { extractIdsFromTag } from "../../utils";

export const createComment = async (data: FormData) => {
  const session = await getServerSession(authOptions);

  const formObject = {} as Insertable<DB.OrderComment>;
  for (const [key, value] of data.entries()) {
    if (key === "attachments") {
      if (formObject[key]) continue;
      const attachments = Array.from(data.getAll('attachments') as unknown as FileList);
      const attachmentsUrls = await uploadAttachments(attachments);
      formObject[key] = attachmentsUrls;
    } else formObject[key] = value;
  }

  const res = await Auth.apiCall("orders/comments", {
    method: "POST",
    body: JSON.stringify(formObject),
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  const userIds = new Set(extractIdsFromTag(formObject.content));
  const userMentionNotifications: Omit<Insertable<DB.MentionNotification>, "initiatorId">[] = [];

  for (const userId of userIds) {
    userMentionNotifications.push({
      recipientId: userId,
      action: DB.NotificationAction.Mention,
      metadata: JSON.stringify({ orderId: formObject.orderId }),
    });
  }

  await sendNotification(session!.secrets.access_token, userMentionNotifications);

  return res.ok;
};
