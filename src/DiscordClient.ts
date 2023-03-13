import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Client,
  REST,
  Routes,
} from "discord.js";
import { data, execute } from "./commands/get-conversion";
import { TOKEN, CLIENTID, GUILD } from "./config.json";

export class DiscordClient extends Client {
  constructor() {
    super({ intents: 131071 });
    this.listenButtons();
  }
  async initialize() {
    await this.login(TOKEN);
    this.setCommands();
  }
  listenButtons() {
    this.on("interactionCreate", async (interaction: BaseInteraction) => {
      if (!interaction.isCommand()) return;
      if (interaction.commandName === "pcnv-conversion") {
        try {
          await execute(interaction as ChatInputCommandInteraction);
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
  setCommands() {
    let commands = [];
    const setBozo = data.toJSON();

    commands.push(setBozo);
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    rest
      .put(Routes.applicationGuildCommands(CLIENTID, GUILD), {
        body: commands,
      })
      .then((data: any) =>
        console.log(
          `Successfully registered ${data.length} application commands.`
        )
      )
      .catch(console.error);
  }
}
