var express = require("express");
var app = express();
var port = process.env.PORT || 3000;

const TOKEN = "NDEzMTEyMDg0ODg1NDA1NzA2.DWUFRw.0f9Mg6prVDlzFIO9RuHgBehb1jY";
const PREFIX = "/";
const Discord = require("discord.js");
const weather = require('weather-js');

function botcalistir() {
    setInterval(function () { console.log('5 Dakika') }, 300000);
}
function mevlanasozleri() {

}

var fortunes = [
    "Evet",
    "Hayır",
    "Olabilir",
    "Kes sesini",
    "Nerden baksan öyle",
    "Hııı ağla"
]
var sozler = [

]
var bot = new Discord.Client();

var servers = {};

bot.on("ready", function () {

    console.log("Hazır!");
    botcalistir();
    mevlanasozleri();
    bot.user.setGame('Twitch Kanalımız','https://twitch.tv/susamgaming');

});

bot.on("guildMemberAdd", function (member) {

    member.guild.channels.find('name','hosgeldiniz').sendMessage(member.toString() + " Hoşgeldin! Susamlanmaya Hazır Ol! ");
});

bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");



    switch (args[0].toLowerCase()) {
        case "yardım":
            var embed = new Discord.RichEmbed();
            message.channel.sendEmbed(embed.setTitle("Komut Listesi").setColor([238, 173, 14]).setDescription("**/yardım , /hakkımızda , /sor <Soru> , /temizle <Mesaj Sayısı> , /zarsalla , /havadurumu <Ülke,Şehir,Eyalet>**"));
            break;
        case "hakkımızda":
            var embed = new Discord.RichEmbed();
            message.channel.sendEmbed(embed.setTitle("Hakkımızda").setColor([238, 173, 14]).setDescription("**Merhaba Arkadaşlar,\n\nSusam Gaming ekibi olarak 3 arkadaşız ve Karabük Üniversitesinde Lisans eğitimi almaktayız.Twitch platformuna yeni katıldık. Twitch platformuna katılmamızın amacı sürekli MOBA ve FPS tarzı oyunlar oynadığımız için ve bunu bir eğlence platformlarına taşıyabileceğimizi düşündüğümüz için buradayız ve sizlerleyiz ...Yayınlarımızda genellikle **\n *** League of Legends \nPlayerunknown's BattleGrounds \nCS GO *** \n**gibi oyunlar dışında farklı oyunlarda oyanamaya çalışıyoruz. Sizlerle kendi eğlencemizi paylaşmak, paylaşırken de eğlendirmek, eğlendirirken güldürmek, gülerkende güzel vakit geçirmeniz dileklerimizle...**"));
            break;
        case "sor":
            if (args[1])
                message.channel.sendMessage(message.author.toString() + ' ' + fortunes[Math.floor(Math.random() * fortunes.length)]);
            else
                message.channel.sendMessage("Anlayamadım dostum.");
            break;
        case "temizle":
            async function purge() {
                message.delete();
                if (!message.member.roles.find("name", "SUSAM")) {
                    message.channel.send('Mesajları temizlemek için \`ADMİN\` rolüne sahip olman gerek.');
                    return;
                }
                if (isNaN(args[1])) {
                    message.channel.send('**►** Lütfen mesaj sayısı belirtin.\n**►** Kullanımı : **' + PREFIX + 'temizle <Mesaj Sayısı>**');
                    return;
                }
                const fetched = await message.channel.fetchMessages({ limit: args[1] });
                console.log(fetched.size + ' mesaj siliniyor...');
                message.channel.bulkDelete(fetched)
                    .catch(error => message.channel.send('Hata: ${error}'));
            }
            purge();
            break;
        case "zarsalla":
            var x = Math.floor((Math.random() * 6) + 1);
            message.channel.sendMessage(message.author.toString() + " Çıkan Sayı : " + x);
            break;
        case "havadurumu":
            if (args[1] != null) {
                weather.find({ search: args[1], degreeType: 'C' }, function (err, result) {
                    if (err) message.channel.send(err);

                    if (result.length === 0) {
                        message.channel.send('**Lütfen geçerli bir lokasyon giriniz.**')
                        return;
                    }
                    var current = result[0].current;
                    var location = result[0].location;

                    const embed = new Discord.RichEmbed()
                        .setDescription(`**${current.skytext}**`)
                        .setAuthor(`${current.observationpoint} için Hava Durumu Bilgileri`)
                        .setThumbnail(current.imageUrl)
                        .setColor([238, 173, 14])
                        .addField('Sıcaklık', `${current.temperature} °C`, true)
                        .addField('Hissedilen', `${current.feelslike} °C`, true)
                        .addField('Rüzgar', current.winddisplay, true)
                        .addField('Nem', `${current.humidity}%`, true)


                    message.channel.send({ embed });
                });
            }
            else
            {
                message.channel.send('**Lütfen geçerli bir lokasyon giriniz.**')
            }
            break;
           case "play":
              if (!args[1]) {
                  message.channel.sendMessage("Lütfen youtube linki atın.")
                  return;
              }
  
              if (!message.member.voiceChannel) {
                  message.channel.sendMessage("Lütfen herhangi bir ses kanalına bağlanın.");
                  return;
              }
  
              if (!servers[message.guild.id]) servers[message.guild.id] =
                  {
                      queue: []
                  };
  
  
              var server = servers[message.guild.id];
  
              server.queue.push(args[1]);
  
              if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                  play(connection, message);
              });
  
              break;
  
          case "skip":
              var server = servers[message.guild.id];
              if (server.dispatcher) server.dispatcher.end();
              break;
          case "stop":
              var server = servers[message.guild.id];
              if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
              break;


        default:
            message.channel.sendMessage("Böyle bir komut bulunamadı dostum. Lütfen **/yardım** yazarak komut listesine bir göz at.")
            break;
    }


});

bot.login(TOKEN);

app.listen(port);
