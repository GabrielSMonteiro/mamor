import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover: string;
  youtubeMusicUrl: string;
  reason: string;
  dateAdded: string;
}

export default function MusicScreen({ navigation }: any) {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      title: "I WANNA BE YOUR SLAVE",
      artist: "Måneskin",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=M%C3%A5neskin+I+WANNA+BE+YOUR+SLAVE",
      reason:
        "Essa música me lembra você pelo fato de direto escutar ela quando estou com você no carro e pelo fato de eu querer ser seu, independente de qualquer coisa. E EU SOU UM GANGSTA",
      dateAdded: "2025-08-16",
    },
    {
      id: "2",
      title: "I Wanna Be Yours",
      artist: "Arctic Monkeys",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Arctic+Monkeys+I+Wanna+Be+Yours",
      reason:
        "'Secrets I have held in my heart, Are harder to hide than I thought, Maybe I just wanna be yours...' Sempre que eu escutava essa música, eu pensava em você, porque por mais que eu tentasse esconder, eu sempre quis ser seu e todos sabiam disso",
      dateAdded: "2025-08-16",
    },
    {
      id: "3",
      title: "Beautiful Things",
      artist: "Benson Boone",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Benson+Boone+Beautiful+Things",
      reason:
        "Essa foi uma música que você conseguiu ressignificar para mim, sempre que eu escutava ela me dava o medo de te perder por achar que eu não era o suficiente, ou que as nossas diferenças podiam falar mais alto, ainda tem um pouco desse sentimento, mas agora quando eu escuto eu lembro de você cantando ela, então de certa forma eu consigo ficar feliz com ela",
      dateAdded: "2025-08-16",
    },
    {
      id: "4",
      title: "Believer",
      artist: "Imagine Dragons",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Imagine+Dragons+Believer",
      reason: "A letra dessa é um tanto quanto autoexplicativa",
      dateAdded: "2025-08-16",
    },
    {
      id: "5",
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=The+Neighbourhood+Sweater+Weather",
      reason:
        "Não sei porque essa me lembra você na verdade, mas acho que só pelo fato de eu gostar dela e ficar feliz cantando",
      dateAdded: "2025-08-16",
    },
    {
      id: "6",
      title: "Another Love",
      artist: "Tom Odell",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Tom+Odell+Another+Love",
      reason:
        "Essa me faz lembrar de você pelos momentos não tão bons que tivemos, eu não penso em 'outro amor' literalmente, mas sim no nosso começo em que rolou tanta coisa e minha cabeça ficou confusa sobre como seguir",
      dateAdded: "2025-08-16",
    },
    {
      id: "7",
      title: "Minha Felicidade",
      artist: "Roberta Campos",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Roberta+Campos+Minha+Felicidade",
      reason:
        "Essa também é bem autoexplicativa, a música fala tudo que eu sinto por você e o quanto você é importante para mim, quase como se fosse um pedaçõ fora do meu peito",
      dateAdded: "2025-08-16",
    },
    {
      id: "8",
      title: "Vagalumes",
      artist: "Pollo part. Ivo Mozart",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Pollo+part.+Ivo+Mozart+Vagalumes",
      reason:
        "Essa eu sempre cantei pensando em você, e isso já tem anos, meu sonho sempre foi poder me declarar para você e dizer o quanto eu te queria e que eu faria/farei tudo que eu puder só para tentar fazer você sorrir",
      dateAdded: "2025-08-16",
    },
    {
      id: "9",
      title: "De Janeiro a Janeiro",
      artist: "Roberta Campos e Nando Reis",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Roberta+Campos+e+Nando+Reis+De+Janeiro+a+Janeiro",
      reason:
        "Eu te amarei pra sempre, de janeiro a janeiro até o mundo acabar, sempre penso em você quando toca essa",
      dateAdded: "2025-08-16",
    },
    {
      id: "10",
      title: "Velha Infância",
      artist: "Tribalistas",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Tribalistas+Velha+Inf%C3%A2ncia",
      reason:
        "Cada verso me lembra de você, me lembra o quanto a gente consegue ser adultos e crianças ao mesmo tempo estando juntos, podemos correr, dançar, cantar e que quando não estou com você não estou completo, eu gosto de você, e gosto de ficar com você, meu riso é tão feliz contigo, meu melhor amigo é mamor",
      dateAdded: "2025-08-16",
    },
    {
      id: "11",
      title: "Imprevisto",
      artist: "Yago Oproprio ft. Rô Rosa",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Yago+Oproprio+ft.+R%C3%B4+Rosa+Imprevisto",
      reason:
        "'De manhã, de madrugada, te quero também de tarde quando nós fica junto, somo inimigo do fim'",
      dateAdded: "2025-08-16",
    },
    {
      id: "12",
      title: "Exagerado",
      artist: "Cazuza",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl: "https://music.youtube.com/search?q=Cazuza+Exagerado",
      reason:
        "Acho que é a música que eu mais canto para você, porque eu sou exagerado, eu te amo demais, eu penso em você demais, eu quero você demais, eu sinto sua falta demais, eu preciso de você demais, eu fico com ciúmes demais, eu me preocupo demais, eu me importo demais, eu sofro demais, eu fico feliz demais, eu fico triste demais, eu vivo demais, eu sinto demais porque você é demais",
      dateAdded: "2025-08-16",
    },
    {
      id: "13",
      title: "Mania De Você",
      artist: "Rita Lee",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Rita+Lee+Mania+De+Voc%C3%AA",
      reason:
        "'Nada melhor do que não fazer nada só pra deitar e rolar com você' meus melhores momentos são com você, por mais que fiquemos deitados em um puff sem fazer nada, além do que MPB me lembra você hehe",
      dateAdded: "2025-08-16",
    },
    {
      id: "14",
      title: "Disritmia",
      artist: "Martinho Da Vila",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Martinho+Da+Vila+Disritmia",
      reason: "Eu amo os seus olhos e a forma com que você me olha",
      dateAdded: "2025-08-16",
    },
    {
      id: "15",
      title: "Deixe-me Ir",
      artist: "1Kilo (Baviera, Knust e Pablo Martins)",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=1Kilo+%28Baviera%2C+Knust+e+Pablo+Martins%29+Deixe-me+Ir",
      reason:
        "Talvez a música que me deixa mais triste quando penso em você, por bastante tempo depois de todas aquelas situações que a gente passou eu pensei em ter que te deixar ir pois acreditava que você não me amava tanto, enfim, essa música bate diferente",
      dateAdded: "2025-08-16",
    },
    {
      id: "16",
      title: "Como É Que A Gente Fica",
      artist: "Henrique e Juliano",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Henrique+e+Juliano+Como+%C3%89+Que+A+Gente+Fica",
      reason:
        "Eu não esperava que fosse te amar tanto assim e que eu me apaixonaria por alguém tanto assim",
      dateAdded: "2025-08-16",
    },
    {
      id: "17",
      title: "Caso Indefinido",
      artist: "Cristiano Araújo",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Cristiano+Ara%C3%BAjo+Caso+Indefinido",
      reason:
        "Essa também surgiu nos momentos tensos, eu não sabia o que seríamos, se daria para continuarmos o que estavamos planejando mas eu sabia que precisava ter você na minha vida, ao meu lado, não consigo viver sem você",
      dateAdded: "2025-08-16",
    },
    {
      id: "18",
      title: "Cuida Bem Dela",
      artist: "Henrique e Juliano",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Henrique+e+Juliano+Cuida+Bem+Dela",
      reason:
        "Essa eu sempre pensava em você enquanto ainda estava namorando, por mais que eu quisesse você, acima de tudo eu queria a sua felicidade e que fosse tratada como a princesa que você é",
      dateAdded: "2025-08-16",
    },
    {
      id: "19",
      title: "Chuva de arroz",
      artist: "Luan Santana",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Luan+Santana+Chuva+de+arroz",
      reason:
        "'E o que eu sei, é que daqui pra frente vai ser nossa cidade, nosso telefone, nosso endereço, nosso apartamento, sabe aquela igreja? Tô aqui na frente, imaginando chuva de arroz na gente!' Não existe mais um mundo em que eu não case com você",
      dateAdded: "2025-08-16",
    },
    {
      id: "20",
      title: "Camisa 10",
      artist: "Turma do Pagode",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Turma+do+Pagode+Camisa+10",
      reason:
        "Eu não me separo de você por nada nesse mundo, você é o amor da minha vida e a razão da minha felicidade",
      dateAdded: "2025-08-16",
    },
    {
      id: "21",
      title: "Instinto",
      artist: "Marvvila, Gamadinho",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Marvvila%2C+Gamadinho+Instinto",
      reason:
        "Essa me lembra o fato dos MEJ points e tals, boa parte da música me faz pensar na sua ótica sobre tudo na verda, e a parte de que eu queria ser o cara certo para você me lembra a minha sensação de insuficiência com aquilo tudo",
      dateAdded: "2025-08-16",
    },
    {
      id: "22",
      title: "Até Que Durou",
      artist: "Péricles",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=P%C3%A9ricles+At%C3%A9+Que+Durou",
      reason:
        "Outra triste que me lembra quando eu tava mal, mas que independente de tudo eu sempre te amei e sempre vou te amar",
      dateAdded: "2025-08-16",
    },
    {
      id: "23",
      title: "Nem de Graça / Saudade Arregaça",
      artist: "Pixote",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Pixote+Nem+de+Gra%C3%A7a+%2F+Saudade+Arrega%C3%A7a",
      reason:
        "Essa me lembra o quanto você é perfeita e incrível e que eu não te trocaria por nada, nem ninguém e honestamente até hoje me pega o fato de você não entender o porquê ou como eu te amo tanto, sendo que você é mais do que eu sempre sonhei",
      dateAdded: "2025-08-16",
    },
    {
      id: "24",
      title: "Sua Mãe Vai Me Amar",
      artist: "Turma do Pagode",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Turma+do+Pagode+Sua+M%C3%A3e+Vai+Me+Amar",
      reason: "Hihi",
      dateAdded: "2025-08-16",
    },
    {
      id: "25",
      title: "Melhor Amigo",
      artist: "Turma do Pagode",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Turma+do+Pagode+Melhor+Amigo",
      reason:
        "A música que reflete um pouco do que eu sempre quis, que você além da minha melhor amiga fosse a minha namorada, e que eu pudesse te amar e cuidar de você para sempre",
      dateAdded: "2025-08-16",
    },
    {
      id: "26",
      title: "Vai Me Dando Corda",
      artist: "Grupo Menos É Mais",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Panda%2C+Fred+e+Fabr%C3%ADcio%2C+%C3%8Dcaro+e+Gilmar+Agora%2FUm+Sonho+louco%2FN%C3%A3o+posso+ter+medo+de+amar",
      reason:
        "'Antes de me envolver já deixei tudo claro! Sou complicado, apegado e ainda tenho a porcentagem de safado é só ligar os fatos melhor tomar cuidado! Vai me dando corda, que rapidinho eu tô batendo na sua porta, a gente brinca de se apega e não se solta, depois não tem volta, pensa na proposta'",
      dateAdded: "2025-08-16",
    },
    {
      id: "27",
      title: "Cantada Boba",
      artist: "Jorge & Mateus",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Jorge+%26+Mateus+Cantada+Boba",
      reason:
        "Essa é bem o que a letra diz mesmo, eu sempre fui uma pessoa muito difícil de lidar ou de me interessar e me relacionar com pessoas mas por você parece que me apaixonei tanto, tão fácil e tão rápido que nem eu sei explicar, dois anos que eu me perdi completamente em você",
      dateAdded: "2025-08-16",
    },
    {
      id: "28",
      title: "Fatalmente/ Separação/ Temporal",
      artist: "Menos é Mais",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Menos+%C3%A9+Mais+Fatalmente%2F+Separa%C3%A7%C3%A3o%2F+Temporal",
      reason:
        "'Me entreguei de corpo inteiro, e mesmo assim você quis outro alguém'",
      dateAdded: "2025-08-16",
    },
    {
      id: "29",
      title: "Vidinha de Balada",
      artist: "Henrique e Juliano",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Henrique+e+Juliano+Vidinha+de+Balada",
      reason:
        "Acho que a música que mais canto tirando Exagerado HEHE Você vai namorar comigo, casar (com comunhão parcial! hehe) e teremos uma vida inteira juntos",
      dateAdded: "2025-08-16",
    },
    {
      id: "30",
      title: "All of Me",
      artist: "John Legend",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=John+Legend+All+of+Me",
      reason:
        "Eu te amo por inteira, completamente, cada parte do meu corpo é completamente obcecado em você",
      dateAdded: "2025-08-16",
    },
    {
      id: "31",
      title: "Outra Vida",
      artist: "Armandinho",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Armandinho+Outra+Vida",
      reason:
        "Como o Armandinho disse, dá para viver várias vidas dentro de uma, então eu pensava em você quando escutava essa porque você não era minha ainda, mas eu sabia que algum dia eu teria você comigo",
      dateAdded: "2025-08-16",
    },
    {
      id: "32",
      title: "Eu Juro",
      artist: "Ferrugem",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl: "https://music.youtube.com/search?q=Ferrugem+Eu+Juro",
      reason:
        "A letra dessa fala tudo, eu morro de saudades quando você está longe, eu morro de amor quando você está perto, e tudo que eu mais desejo é dormir e acordar com você",
      dateAdded: "2025-08-16",
    },
    {
      id: "33",
      title: "Amor Livre",
      artist: "Filipe Ret",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Filipe+Ret+Amor+Livre",
      reason:
        "'Quantas coisa aconteceram em pouco tempo, baby? Quantas confirmações tivemos nesses meses? Quantas histórias no carro? Nós sabe viver'",
      dateAdded: "2025-08-16",
    },
    {
      id: "34",
      title: "Mágica",
      artist: "Matheus & Kauan ft. Gusttavo Lima",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Matheus+%26+Kauan+ft.+Gusttavo+Lima+M%C3%A1gica",
      reason:
        "Essa fala o quanto eu trocaria tudo por você e que ninguém ou nada mais consegue me satisfazer e me fazer feliz",
      dateAdded: "2025-08-16",
    },
    {
      id: "35",
      title: "Meu Coração Deu Pt",
      artist: "Wesley Safadão Part. Matheus e Kauan",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Wesley+Safad%C3%A3o+Part.+Matheus+e+Kauan+Meu+Cora%C3%A7%C3%A3o+Deu+Pt",
      reason: "Er... essa é pesada né",
      dateAdded: "2025-08-16",
    },
    {
      id: "36",
      title: "Exclusividade",
      artist: "Matheus & Kauan",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Matheus+%26+Kauan+Exclusividade",
      reason:
        "Meio autoexplicativa também, foi mais ou menos o que a gente passou com a questão de não ter exclusividade e acabar magoando e depois a gente se assumir",
      dateAdded: "2025-08-16",
    },
    {
      id: "37",
      title: "The Only Exception",
      artist: "Paramore",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Paramore+The+Only+Exception",
      reason:
        "Você me faz acreditar no amor e como eu tenho vontade de cantar, dançar e me divertir com você",
      dateAdded: "2025-08-16",
    },
    {
      id: "38",
      title: "Umbrella",
      artist: "Rihanna ft. JAY-Z",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Rihanna+ft.+JAY-Z+Umbrella",
      reason: "Essa música me faz feliz, então me lembra você",
      dateAdded: "2025-08-16",
    },
    {
      id: "39",
      title: "Beautiful Girls",
      artist: "Sean Kingston",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Sean+Kingston+Beautiful+Girls",
      reason: "Sem motivos, eu gosto muito e a sensação me lembra você",
      dateAdded: "2025-08-16",
    },
    {
      id: "40",
      title: "Love The Way You Lie",
      artist: "Eminem ft. Rihanna",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Eminem+ft.+Rihanna+Love+The+Way+You+Lie",
      reason:
        "Rihanna é cantora de cria!! E eu fiquei um tempo sem acreditar que você me amava pelo que aconteceu",
      dateAdded: "2025-08-16",
    },
    {
      id: "41",
      title: "Espumas Ao Vento",
      artist: "Fagner",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/watch?v=Fuj-y3UCb9k&si=dFRFwvOJ5gJYyT6j",
      reason: "Lembro de você brava com a sua mãe repetindo kkkkkkkkk",
      dateAdded: "2025-08-16",
    },
    {
      id: "42",
      title: "Kiss Me Thru The Phone",
      artist: "Soulja Boy Tell'em ft. Sammie",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Soulja+Boy+Tell%27em+ft.+Sammie+Kiss+Me+Thru+The+Phone",
      reason: "Você num me ama e num mim quer pra morar juntos",
      dateAdded: "2025-08-16",
    },
    {
      id: "43",
      title: "The First Time",
      artist: "Damiano David",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Damiano+David+The+First+Time",
      reason: "Essa me lembra a imersão",
      dateAdded: "2025-08-16",
    },
    {
      id: "44",
      title: "Ordinary",
      artist: "Alex Warren",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Alex+Warren+Ordinary",
      reason:
        "Tirando o fato que eu viro cristão sempre que vejo uma foto sua, tirando o quanto você canta essa música, ela me faz lembrar você porque meu mundo mudou quando eu me apaixonei por você e ainda mais quando foi correspondido",
      dateAdded: "2025-08-16",
    },
    {
      id: "45",
      title: "Hotel Caro",
      artist: "Baco Exu do Blues & Luísa Sonza",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Baco+Exu+do+Blues+%26+Lu%C3%ADsa+Sonza+Hotel+Caro",
      reason: "Eu me sinto culpado as vezes por coisas que aconteceram",
      dateAdded: "2025-08-16",
    },
    {
      id: "46",
      title: "Belong Together",
      artist: "Mark Ambor",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Mark+Ambor+Belong+Together",
      reason:
        "'You and me belong together Like cold iced tea and warmer weather Where we lay out late underneath the pines And we still have fun when the Sun won't shine You and me belong together all the time'",
      dateAdded: "2025-08-16",
    },
    {
      id: "47",
      title: "Me Apaixonei Pela Pessoa Errada",
      artist: "Exaltasamba",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Exaltasamba+Me+Apaixonei+Pela+Pessoa+Errada",
      reason:
        "Meu Deus, essa me lembrava muito você quando ainda estava no seu antigo relacionamento",
      dateAdded: "2025-08-16",
    },
    {
      id: "48",
      title: "Lapada Dela",
      artist: "Grupo Menos é Mais e Matheus Fernandes",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Grupo+Menos+%C3%A9+Mais+e+Matheus+Fernandes+Lapada+Dela",
      reason:
        "ME APAIXONEI POR UMA MENINA QUE TEM 1,60 m E NÃO TEM TATUAGEM NÃO",
      dateAdded: "2025-08-16",
    },
    {
      id: "49",
      title: "É com ela que eu estou",
      artist: "Cristiano Araújo",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Cristiano+Ara%C3%BAjo+%C3%89+com+ela+que+eu+estou",
      reason:
        "Essa me lembra você mais especificamente no momento do meu término",
      dateAdded: "2025-08-16",
    },
    {
      id: "50",
      title: "Te esperando",
      artist: "Luan Santana",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Luan+Santana+Te+esperando",
      reason:
        "Eu sempre estive e sempre estarei te esperando independente do que aconteça, pensava nessa quando surgiu a ideia de não darmos certos juntos",
      dateAdded: "2025-08-16",
    },
    {
      id: "51",
      title: "Pétalas",
      artist: "Tavin",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl: "https://music.youtube.com/search?q=Tavin+P%C3%A9talas",
      reason:
        "Meu Deus, essa é tão autodescritiva, quando descobri toda aquela situação com seu antigo relacionamento me senti assim além de ouvir coisas da Eduarda, enfim já foi",
      dateAdded: "2025-08-16",
    },
    {
      id: "52",
      title: "More Than A Woman",
      artist: "Bee Gees",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Bee+Gees+More+Than+A+Woman",
      reason:
        "This is the only way that we should fly This is the only way to go And if I lose your love, I know I would die Oh, say you'll always be my baby, we can make it shine We can take forever, just a minute at a time, oh",
      dateAdded: "2025-08-16",
    },
    {
      id: "53",
      title: "Say You Won't Let Go",
      artist: "James Arthur",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=James+Arthur+Say+You+Won%27t+Let+Go",
      reason:
        "Meu Deus, essa parece que foi escrita pensando em como eu me sentia com você e meus planos futuros e o quanto eu te amo! 'I knew I loved you then, but you'd never know 'Cause I played it cool when I was scared of letting go I knew I needed you, but I never showed I wanna stay with you until we're grey and old Just say you won't let go'",
      dateAdded: "2025-08-16",
    },
    {
      id: "54",
      title: "Yellow",
      artist: "Coldplay",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl: "https://music.youtube.com/search?q=Coldplay+Yellow",
      reason:
        "Olhar para o céu me lembra você, principalmente quando está estrelado, acho que aos poucos está virando meu horário favorito do dia (a noite) You know I love you so?",
      dateAdded: "2025-08-16",
    },
    {
      id: "55",
      title: "Lonely",
      artist: "Akon",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl: "https://music.youtube.com/search?q=Akon+Lonely",
      reason: "Mamor mim abandonou",
      dateAdded: "2025-08-16",
    },
    {
      id: "56",
      title: "The Loneliest",
      artist: "Måneskin",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=M%C3%A5neskin+The+Loneliest",
      reason:
        "Maneskin me lembra você e ás vez me traz o sentimento que posso te perder",
      dateAdded: "2025-08-16",
    },
    {
      id: "57",
      title: "It's You",
      artist: "Ali Gatie",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Ali+Gatie+It%27s+You",
      reason:
        "É você, sempre foi você, sempre é você e sempre será você o motivo da minha felicidade, o motivo de eu querer ir a faculdade, o motivo de eu te amar tanto",
      dateAdded: "2025-08-16",
    },
    {
      id: "58",
      title: "Nosso Amor Quer Paz",
      artist: "Péricles e Marvvila",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=P%C3%A9ricles+e+Marvvila+Nosso+Amor+Quer+Paz",
      reason: "O confronto da razão e dos sentimentos desde que nos conhecemos",
      dateAdded: "2025-08-16",
    },
    {
      id: "59",
      title: "Vai Me Dando Corda",
      artist: "Menos é Mais",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Menos+%C3%A9+Mais+Vai+Me+Dando+Corda",
      reason:
        "Pagode em si me lembra você, e com essa eu penso o quanto eu quero te amar e te pertencer se você for dando corda hehe",
      dateAdded: "2025-08-16",
    },
    {
      id: "60",
      title: "Tenho Medo",
      artist: "Zé Vaqueiro",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Z%C3%A9+Vaqueiro+Tenho+Medo",
      reason:
        "Eu tinha muito medo de entrar nesse relacionamento com toda a carga emocional e me machucar",
      dateAdded: "2025-08-16",
    },
    {
      id: "61",
      title: "Casal Do Ano",
      artist: "Atitude 67",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Atitude+67+Casal+Do+Ano",
      reason: "A gente é o melhor casal do mundooooo",
      dateAdded: "2025-08-16",
    },
    {
      id: "62",
      title: "Girls Just Want To Have Fun",
      artist: "Cyndi Lauper",
      album: "",
      cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
      youtubeMusicUrl:
        "https://music.youtube.com/search?q=Cyndi+Lauper+Girls+Just+Want+To+Have+Fun",
      reason:
        "EU AMO ESSA MÚSICA E NÃO SEI PORQUÊ ME LEMBRA VOCÊ, MAS ACHO QUE TOCOU NO EXTERNA",
      dateAdded: "2025-08-16",
    },
  ]);

  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    reason: "",
    youtubeMusicUrl: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const handlePlayPause = (songId: string, youtubeMusicUrl: string) => {
    if (currentPlaying === songId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(songId);

      if (youtubeMusicUrl && youtubeMusicUrl !== "#") {
        Linking.canOpenURL(youtubeMusicUrl)
          .then((supported) => {
            if (supported) {
              Linking.openURL(youtubeMusicUrl);
            } else {
              Alert.alert("Erro", "Não foi possível abrir o YouTube Music");
            }
          })
          .catch(() => {
            Alert.alert("Erro", "Erro ao tentar abrir a música");
          });
      }
    }
  };

  const handleAddSong = () => {
    if (newSong.title && newSong.artist && newSong.reason) {
      const song: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
        album: newSong.album,
        cover: "https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=♪",
        youtubeMusicUrl: newSong.youtubeMusicUrl || "#",
        reason: newSong.reason,
        dateAdded: new Date().toISOString().split("T")[0],
      };

      setSongs([...songs, song]);
      setNewSong({
        title: "",
        artist: "",
        album: "",
        reason: "",
        youtubeMusicUrl: "",
      });
      setShowAddModal(false);

      Alert.alert(
        "Sucesso! 🎵",
        "Música adicionada à sua playlist do coração!"
      );
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos o título, artista e o motivo especial"
      );
    }
  };

  const handleEditSong = () => {
    if (
      editingSong &&
      editingSong.title &&
      editingSong.artist &&
      editingSong.reason
    ) {
      setSongs(
        songs.map((song) => (song.id === editingSong.id ? editingSong : song))
      );
      setShowEditModal(false);
      setEditingSong(null);

      Alert.alert("Sucesso! 🎵", "Música editada com sucesso!");
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos o título, artista e o motivo especial"
      );
    }
  };

  const handleDeleteSong = (songId: string, songTitle: string) => {
    Alert.alert(
      "Remover Música",
      `Tem certeza que deseja remover "${songTitle}" da sua playlist?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => setSongs(songs.filter((song) => song.id !== songId)),
        },
      ]
    );
  };

  const openEditModal = (song: Song) => {
    setEditingSong({ ...song });
    setShowEditModal(true);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSong = (song: Song) => (
    <View key={song.id} style={styles.songCard}>
      <View style={styles.songContent}>
        <View style={styles.albumCover}>
          <Image
            source={{ uri: song.cover }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.songInfo}>
          <View style={styles.songDetails}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {song.artist}
            </Text>
            {song.album && (
              <Text style={styles.songAlbum} numberOfLines={1}>
                {song.album}
              </Text>
            )}
          </View>

          <View style={styles.reasonContainer}>
            <Text style={styles.reasonText}>"{song.reason}"</Text>
          </View>

          <View style={styles.controlsContainer}>
            <View style={styles.playControls}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  currentPlaying === song.id && styles.playingButton,
                ]}
                onPress={() => handlePlayPause(song.id, song.youtubeMusicUrl)}
              >
                <Ionicons
                  name={currentPlaying === song.id ? "pause" : "play"}
                  size={16}
                  color={currentPlaying === song.id ? "#FFFFFF" : "#FF69B4"}
                />
              </TouchableOpacity>

              {song.youtubeMusicUrl && song.youtubeMusicUrl !== "#" && (
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => Linking.openURL(song.youtubeMusicUrl)}
                >
                  <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.actionControls}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(song)}
              >
                <Ionicons name="create-outline" size={14} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteSong(song.id, song.title)}
              >
                <Ionicons name="trash-outline" size={14} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.dateAdded}>
            Adicionada em {new Date(song.dateAdded).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#FFE4E1", "#FFB6C1", "#FF69B4"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Música</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Músicas que me fazem lembrar de você 🎵
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar músicas..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{songs.length}</Text>
          <Text style={styles.statsText}>
            {songs.length === 1 ? "música especial" : "músicas especiais"}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {filteredSongs.map(renderSong)}

          {filteredSongs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎵</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery
                  ? "Nenhuma música encontrada"
                  : "Nenhuma música ainda"}
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "Tente buscar por outro termo"
                  : "Adicione músicas que fazem você lembrar dela"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setShowAddModal(true)}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>
                    Adicionar Primeira Música
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Modal Adicionar */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Nova Música</Text>

              <ScrollView
                style={styles.modalForm}
                showsVerticalScrollIndicator={false}
              >
                <TextInput
                  style={styles.modalInput}
                  value={newSong.title}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, title: text })
                  }
                  placeholder="Nome da música *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={newSong.artist}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, artist: text })
                  }
                  placeholder="Artista *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={newSong.album}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, album: text })
                  }
                  placeholder="Álbum (opcional)"
                />
                <TextInput
                  style={[styles.modalInput, styles.reasonInput]}
                  value={newSong.reason}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, reason: text })
                  }
                  placeholder="Por que essa música me lembra de você? *"
                  multiline
                  textAlignVertical="top"
                />
                <TextInput
                  style={styles.modalInput}
                  value={newSong.youtubeMusicUrl}
                  onChangeText={(text) =>
                    setNewSong({ ...newSong, youtubeMusicUrl: text })
                  }
                  placeholder="Link do YouTube Music (opcional)"
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewSong({
                      title: "",
                      artist: "",
                      album: "",
                      reason: "",
                      youtubeMusicUrl: "",
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton]}
                  onPress={handleAddSong}
                >
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Editar */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Música</Text>

              <ScrollView
                style={styles.modalForm}
                showsVerticalScrollIndicator={false}
              >
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.title || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, title: text } : null
                    )
                  }
                  placeholder="Nome da música *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.artist || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, artist: text } : null
                    )
                  }
                  placeholder="Artista *"
                />
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.album || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, album: text } : null
                    )
                  }
                  placeholder="Álbum (opcional)"
                />
                <TextInput
                  style={[styles.modalInput, styles.reasonInput]}
                  value={editingSong?.reason || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, reason: text } : null
                    )
                  }
                  placeholder="Por que essa música me lembra de você? *"
                  multiline
                  textAlignVertical="top"
                />
                <TextInput
                  style={styles.modalInput}
                  value={editingSong?.youtubeMusicUrl || ""}
                  onChangeText={(text) =>
                    setEditingSong((prev) =>
                      prev ? { ...prev, youtubeMusicUrl: text } : null
                    )
                  }
                  placeholder="Link do YouTube Music (opcional)"
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowEditModal(false);
                    setEditingSong(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.addModalButton]}
                  onPress={handleEditSong}
                >
                  <Text style={styles.addButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 4,
  },
  statsText: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  songContent: {
    padding: 16,
  },
  albumCover: {
    alignSelf: "center",
    marginBottom: 12,
  },
  coverImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  songInfo: {
    flex: 1,
  },
  songDetails: {
    marginBottom: 12,
    alignItems: "center",
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 2,
  },
  songAlbum: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  reasonContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  playControls: {
    flexDirection: "row",
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  playingButton: {
    backgroundColor: "#FF69B4",
    borderColor: "#FF69B4",
  },
  actionControls: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  dateAdded: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF69B4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%", // Aumentei para dar mais espaço
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalForm: {
    padding: 20,
    flex: 1, // Removido maxHeight fixo para que se adapte ao conteúdo
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  reasonInput: {
    minHeight: 120, // Aumentei a altura mínima
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  addModalButton: {
    backgroundColor: "#FF69B4",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
