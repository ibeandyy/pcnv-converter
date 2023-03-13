import { wallets } from "../wallets.json";
import { amounts } from "../amounts.json";
import {
  ChatInputCommandInteraction,
  Options,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("pcnv-conversion")
  .setDescription(
    "Get the amount of pCNV you will receive from burning your CNV"
  )
  .addSubcommand((option) =>
    option
      .setName("all-wallets")
      .setDescription("Get all wallets and their amounts")
  )

  .addSubcommand((option) =>
    option
      .setName("individual-wallet")
      .setDescription(
        "Get the amount of pCNV you will receive from burning your CNV"
      )
      .addStringOption((option) =>
        option
          .setName("wallet-address")
          .setDescription("The wallet to look up")
          .setRequired(true)
      )
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const allAmounts = wallets
    .map((wallet: string, index: number) => {
      return {
        wallet,
        amount: amounts[index],
      };
    })
    .sort((a: any, b: any) => b.amount - a.amount);
  if (interaction.options.getSubcommand() === "all-wallets") {
    let response = allAmounts.map(
      (wallet: any) => `${wallet.wallet} - ${wallet.amount} CNV\n`
    );
    //split response into several arrays of 2000 characters
    let responseArray = [];
    let responseString = "";
    for (let i = 0; i < response.length; i++) {
      if (responseString.length + response[i].length > 2000) {
        responseArray.push(responseString);
        responseString = "";
      }
      responseString += response[i];
    }
    responseArray.push(responseString);
    for (let i = 0; i < 10; i++) {
      if (i == 0)
        await interaction.reply({
          content: responseArray[i],
          ephemeral: true,
        });
      else
        await interaction.followUp({
          content: responseArray[i],
          ephemeral: true,
        });
      if (i == 10)
        interaction.followUp({
          content: "Remaining wallets are set to receive <1 CNV",
          ephemeral: true,
        });
    }
  } else {
    const userAmount = allAmounts.find((wallet: any) => {
      return (
        wallet.wallet ===
        interaction.options.getString("wallet-address", true).toLowerCase()
      );
    });
    if (!userAmount)
      return interaction.reply({
        content: "You have no CNV to convert",
        ephemeral: true,
      });
    await interaction.reply({
      content: `At conversion under the latest Proposal ${userAmount?.wallet} will have ${userAmount?.amount} CNV`,
      ephemeral: true,
    });
  }
};
