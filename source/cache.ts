import { BotClients } from "./settings/clients";

export type refreshCacheFunction = (
  tgId: string
) => Promise<{ scene: string; registered: boolean } | null>;

export type updateCacheFunction = (
  tgId: string,
  state: { scene?: string; registered?: boolean }
) => Promise<void>;

export class UserCache {
  constructor(
    private redisClient: BotClients["redis"],
    private dbClient: BotClients["database"]
  ) {}

  private generateKey(tgId: string) {
    return `user:${tgId}`;
  }

  public async pull(
    tgId: string
  ): Promise<{ scene: string; registered: boolean } | null> {
    const key = this.generateKey(tgId);

    let cache = await this.redisClient.get(key);
    if (!cache) {
      // database query
      const state = await this.dbClient.state.findFirst({
        where: { user_tg_id: { equals: tgId } },
      });

      if (!state) {
        return null;
      }
      if (!state.scene) {
        throw new Error(`Can't find State.scene for user; TG ID = ${tgId}`);
      }
      if (typeof state.registered !== "boolean") {
        throw new Error(`Can't find State.registered for user; TG ID = ${tgId}`);
      }

      cache = JSON.stringify({
        scene: state.scene,
        registered: state.registered,
      });
      await this.redisClient.set(key, cache);
    }

    await this.redisClient.expire(key, 45);
    return JSON.parse(cache);
  }

  public async push(tgId: string, state: { scene?: string; registered?: boolean }) {
    // update data in DB
    await this.dbClient.state.update({
      where: { user_tg_id: tgId },
      data: { ...state },
    });

    const key = this.generateKey(tgId);
    await this.redisClient.del(key); // clear the cache (its data is no more valuable)
  }
}
