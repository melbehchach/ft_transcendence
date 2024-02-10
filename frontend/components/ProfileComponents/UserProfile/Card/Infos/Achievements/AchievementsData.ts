import { achievementsObj } from "./Achievements.types";
import Image from "next/image";
import Freshman from "./svgs/Freshman";
import Snowden from "./svgs/Snowden";
import newHero from "./svgs/newHero";
import Rak3ajbni from "./svgs/Rak3ajbni";
import Lion from "./svgs/Lion";
import Lkherraz from "./svgs/Lkherraz";
import getALife from "./svgs/getALife";

const achievementsData = [
    {
        id: 1,
        state: true,
        type: "Freshman",
        description: "Created Account",
        Icon: Freshman
    },
    {
        id: 2,
        state: true,
        type: "Snowden",
        description: "Enable 2FA",
        Icon: Snowden
    },
    {
        id: 3,
        state: true,
        type: "New hero in town",
        description: "Won a game",
        Icon: newHero
    },
    {
        id: 4,
        state: true,
        type: "Rak 3ajbni",
        description: "Won 3 games on a row",
        Icon: Rak3ajbni
    },
    {
        id: 5,
        state: true,
        type: "sbe3",
        description: "Won 10 games",
        Icon: Lion
    },
    {
        id: 6,
        state: true,
        type: "L'kherraz",
        description: "Won 50 games",
        Icon: Lkherraz
    },
    {
        id: 7,
        state: true,
        type: "Get a life bro",
        description: "Won 100 games",
        Icon: getALife
    }
];

export default achievementsData;