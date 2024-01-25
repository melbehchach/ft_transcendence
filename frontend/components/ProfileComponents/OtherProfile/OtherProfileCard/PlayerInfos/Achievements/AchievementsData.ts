import { achievementsObj } from "./Achievements.types";
import Image from "next/image";
import Freshman from "./svgs/Freshman.svg";
import Snowden from "./svgs/Snowden.svg"
import newHero from "./svgs/newHero.svg"
import Rak3ajbni from "./svgs/Rak3ajbni.svg"
import Lion from "./svgs/Lion.svg"
import Lkherraz from "./svgs/Lkherraz.svg"
import getALife from "./svgs/getALife.svg"

const achievementsData = [
    {
        id: 1,
        state: true,
        type: "Freshman",
        description: "Created Account",
        icon: Freshman
    },
    {
        id: 2,
        state: true,
        type: "Snowden",
        description: "Enable 2FA",
        icon: Snowden
    },
    {
        id: 3,
        state: true,
        type: "New hero in town",
        description: "Won a game",
        icon: newHero
    },
    {
        id: 4,
        state: true,
        type: "Rak 3ajbni",
        description: "Won 3 games on a row",
        icon: Rak3ajbni
    },
    {
        id: 5,
        state: true,
        type: "sbe3",
        description: "Won 10 games",
        icon: Lion
    },
    {
        id: 6,
        state: true,
        type: "L'kherraz",
        description: "Won 50 games",
        icon: Lkherraz
    },
    {
        id: 7,
        state: true,
        type: "Get a life bro",
        description: "Won 100 games",
        icon: getALife
    }
];

export default achievementsData;