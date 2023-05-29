import { BotClients } from "./settings/clients";

export class UserCache {
  constructor(
    private redisClient: BotClients["redis"],
    private dbClient: BotClients["database"]
  ) {}

  private generateKey(tgId: string) {
    return `user:${tgId}`;
  }

  public async pull(tgId: string) {
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

      cache = JSON.stringify({ scene: state.scene });
      await this.redisClient.set(key, cache);
    }

    await this.redisClient.expire(key, 45);
    return JSON.parse(cache);
  }
}
