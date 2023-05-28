import { BotClients } from "./settings/clients";

class UserCache {
  constructor(
    private redisClient: BotClients["redis"],
    private dbClient: BotClients["database"]
  ) {}

  public async refresh(tgId: string) {
    const key = `user:${tgId}`;

    const data = await this.redisClient.get(key);
    if (data) {
      await this.redisClient.expire(key, 90);
    } else {
      // database query
      const query = await this.dbClient.state.findFirst({
        where: { user_tg_id: { equals: tgId } },
      });
      if (!query) {
        throw new Error(`Can't find State object for user; TG ID = ${tgId}`);
      }

      const json = JSON.stringify({ scene: query.scene });
      await this.redisClient.set(key, json);
      await this.redisClient.expire(key, 90);
    }
  }
}
