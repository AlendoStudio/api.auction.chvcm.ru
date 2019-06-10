import {Request, Response} from "express";

import {EmailNotifications, Entity} from "src";

export default async function unverifyEntity(
  req: Request,
  res: Response,
): Promise<void> {
  if (req.entity.verified) {
    await Entity.update(
      {
        verified: false,
      },
      {
        where: {
          id: req.entity.id as string,
        },
      },
    );

    await EmailNotifications.instance.unverified(req.entity);
  }
}
