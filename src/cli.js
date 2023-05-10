#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import { mdLinks } from './index.js';
import { statsLinks, validateStatsLinks } from './functions.js';

const userPath = process.argv[2];
const argvUser = process.argv;

const cli = (route, argv) => {
  if (route === undefined || null) {
    console.log(chalk.bgYellow("Ops! Insira um caminho ⚠ "));
  } else if ((argv.includes("--validate") && (argv.includes("--stats") ))
  ) {
    mdLinks(route, { validate: true }).then((res) => {
      const validatelinks = validateStatsLinks(res);
      console.table(validatelinks);
    });
  } else if (argv.includes("--validate") ){
    mdLinks(route, { validate: true })
      .then((res) => {
        if (res.length === 0) {
          return console.log(chalk.bgYellow.bold("Nenhum link encontrado"));
        }
        res.forEach((link) =>
          console.log(
            chalk.yellow.bold.italic(link.file),
            chalk.blue.bold(link.text),
            chalk.magenta.bold.underline(link.href),
            chalk.blue.bold("Status:" + link.status, link.OK)
          )
        );
      })
      .catch((error) => console.error(chalk.bgRed.bold(error)));
  } else if (argv.includes("--stats")) {
    mdLinks(route).then((res) => {
      const stats = statsLinks(res);
      console.table(stats);
    });
  } else if (argv.includes("--help")) {
    console.log(
      chalk.bold.blue(
        figlet.textSync("Mdlinks", {
          font: "Big",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 100,
        })
      )
    );
  } else if (argv.length === 3) {
    mdLinks(route)
      .then((res) => {
        if (res.length === 0) {
          return console.log(chalk.bgYellow.bold("Nenhum link encontrado "));
        }
        res.forEach((link) =>
          console.log(
            chalk.yellow.bold.italic(link.file),
            chalk.magenta.bold.underline(link.href),
            chalk.blue.bold(link.text)
          )
        );
      })
      .catch((error) => console.error(chalk.bgRed.bold(error)));
  } else if (
    !(argv.includes("--validate") || argv.includes("--v")) &&
    !(argv.includes("--stats") || argv.includes("--s")) &&
    !argv.includes("--sv")
  ) {
    console.log(
      chalk.bgYellow.bold("Digite um comando válido"),
      "\n",
      chalk.yellow.bold(" Veja os comandos --help")
    );
  }
};

cli(userPath, argvUser);

export default{ cli };
