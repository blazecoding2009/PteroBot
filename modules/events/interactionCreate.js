module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, interaction.client);
            } catch (error) {
                interaction.client.logger.error(error);
                if (interaction.replied) return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isButton()) {
            if (!interaction.client.embeds.get(interaction.message.id)) return;
            let embeds = await interaction.client.embeds.get(interaction.message.id);
            let pageno=embeds.no;
            if (interaction.customId == "next") {
                pageno++;
                if (pageno > embeds.embeds.length-1) pageno=0;
                interaction.message.edit({ embeds: [embeds.embeds[pageno]]});
            } else if (interaction.customId == "back") {
                pageno = pageno-1;
                if (pageno < 0) pageno = embeds.embeds.length-1;
                interaction.message.edit({ embeds: [embeds.embeds[pageno]]});
            }
            interaction.deferUpdate();
            await interaction.client.embeds.set(interaction.message.id, {embeds: embeds.embeds, no: pageno})
        }
	},
};